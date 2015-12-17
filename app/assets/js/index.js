/*!
 * suitsupply
 * 
 * 
 * @author Goran Dimitrovski
 * @version 1.0.0
 * Copyright 2015. ISC licensed.
 */
(function (window, document) {

    'use strict';

    var input = document.getElementById('filter-input');
    var overlay = document.getElementById('overlay');
    var closeOverlay = document.getElementById('close-overlay');
    var datepickerContainer = document.getElementById('datepicker-container-from');
    var error = document.getElementById('error');
    var selectDay;
    var selectMonth;
    var selectYear;
    var response;

    function init() {
        error.classList.add('hidden');
        error.innerHTML = '';
        datepicker.init('datepicker-container-from');
        ajax('data.json', 'GET', false, handleResponse);
        input.onkeyup = handleFiltering;
        selectDay = datepickerContainer.getElementsByClassName('datepicker-days')[0];
        selectMonth = datepickerContainer.getElementsByClassName('datepicker-months')[0];
        selectYear = datepickerContainer.getElementsByClassName('datepicker-years')[0];
        selectDay.onchange = selectMonth.onchange = selectYear.onchange = handleFiltering;
        closeOverlay.onclick = handleCloseOverlay;
    }

    function isObject(obj) {
        return obj === Object(obj);
    }

    function drawList(data) {
        try {
            response = JSON.parse(data);
            var articleList = document.getElementById('article-list').getElementsByTagName('tbody')[0];

            for (var i = response.results.length - 1; i >= 0; i--) {

                var row = articleList.insertRow(0);

                var cell1 = row.insertCell(0);
                var anchor = document.createElement('a');
                anchor.setAttribute('data-id', i);
                anchor.innerHTML = response.results[i].title;
                anchor.onclick = handleTitleClick;
                cell1.appendChild(anchor);

                var cell2 = row.insertCell(1);
                cell2.setAttribute('class', 'read-more');
                cell2.innerHTML = '<a  href="' + response.results[i].unescapedUrl + '" target="_blank" >Read more</a>';
            }

        } catch (e) {
            console.log(e);
        }
    }

    function formatAjaxData(dataObj) {
        var keys = Object.keys(dataObj);
        var data = '';

        for (var i = 0; i < keys.length; i++) {
            var val = dataObj[keys[i]];
            data = keys[i] + '=' + val;
        }

        return data;
    }

    function getHttpRequestObject() {
        var xmlHttpRequst = false;

        // Mozilla/Safari/Non-IE
        if (window.XMLHttpRequest) {
            xmlHttpRequst = new XMLHttpRequest();
        }
        // IE
        else if (window.ActiveXObject) {
            xmlHttpRequst = new ActiveXObject('Microsoft.XMLHTTP');
        }
        return xmlHttpRequst;
    }

    function handleResponse() {

        if (this.readyState === this.DONE) {
            if (this.status === 200) {
                drawList(this.response);
            }else {
                error.innerHTML = 'An error has occured';
                error.classList.remove('hidden');
            }
        }


    }

    function ajax(url, method, async, responseHandler, data) {

        if (url === '') {
            return false;
        }

        method = method || 'GET';
        async = async || true;
        data = isObject(data) ? formatAjaxData(data) : null;

        var xmlHttpRequst = getHttpRequestObject();

        if (xmlHttpRequst !== false) {

            if (method === 'GET') {
                url = url + '?' + data;
                data = null;
            }
            xmlHttpRequst.open(method, url, async);

            if (method === 'POST') {

                xmlHttpRequst.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            }

            xmlHttpRequst.onreadystatechange = responseHandler;
            xmlHttpRequst.send(data);
        }

    }

    function openModal() {
        overlay.classList.remove('hidden');
    }

    function closeModal() {
        overlay.classList.add('hidden');
    }

    function handleTitleClick() {
        var id = this.getAttribute('data-id');

        if (response && response.results) {
            displayArticle(response.results[id]);
            openModal();
        }
    }

    function displayArticle(article) {
        var title = overlay.getElementsByTagName('h1')[0];
        var publisher = overlay.getElementsByTagName('h2')[0];
        var date = overlay.getElementsByTagName('h3')[0];
        var content = overlay.getElementsByTagName('p')[0];

        title.innerHTML = article.titleNoFormatting;
        publisher.innerHTML = article.publisher;
        date.innerHTML = article.publishedDate;
        content.innerHTML = article.content;
        content.innerHTML += '<a href="' + article.unescapedUrl + '" target="_blank" >Read more</a>';

        displayArticleImage(article.image);
        displayRelatedArticles(article.relatedStories);
    }

    function displayArticleImage(image) {
        var imageContainer = document.getElementById('article-image-container');
        imageContainer.innerHTML = '';

        var anchor = document.createElement('a');
        anchor.setAttribute('href', image.originalContextUrl);

        var img = document.createElement('img');
        img.setAttribute('src', image.url);
        img.setAttribute('width', image.tbWidth);
        img.setAttribute('height', image.tbHeight);
        img.setAttribute('alt', image.publisher);

        anchor.appendChild(img);
        imageContainer.appendChild(anchor);
    }

    function displayRelatedArticles(relatedStories) {

        var relatedArticle = document.getElementById('related-articles');
        var itemsList = '';

        for (var i = 0; i < relatedStories.length; i++) {
            itemsList = '<li><a href="' + relatedStories[i].unescapedUrl + '" target="_blank" >' + relatedStories[i].title + '</a></li>';
        }

        relatedArticle.innerHTML = itemsList;
    }

    function handleFiltering() {
        var inputVal = document.getElementById('filter-input').value.toLowerCase();
        var articleList = document.getElementById('article-list').getElementsByTagName('tr');

        for (var i = 0; i < articleList.length; i++) {
            articleList[i].classList.remove('hidden');
        }

        if (inputVal.length > 0) {
            handleContentFiltering(articleList, inputVal);
        }

        handleDateFilter(articleList);
    }

    function handleContentFiltering(articleList, inputVal) {

        for (var j = 0; j < response.results.length; j++) {

            if (response.results[j].content.toLowerCase().indexOf(inputVal) === -1 &&
                response.results[j].titleNoFormatting.toLowerCase().indexOf(inputVal) === -1) {
                articleList[j].classList.add('hidden');
            }
        }
    }

    function handleDateFilter(articleList) {
        var selectedDate;

        if (selectDay.options[selectDay.selectedIndex].value !== '--' &&
            selectMonth.options[selectMonth.selectedIndex].value !== '--' &&
            selectYear.options[selectYear.selectedIndex].value !== '--') {

            selectedDate = new Date(selectYear.options[selectYear.selectedIndex].value +
                '/' + selectMonth.options[selectMonth.selectedIndex].value +
                '/' + selectDay.options[selectDay.selectedIndex].value);

            for (var j = 0; j < response.results.length; j++) {

                if (new Date(response.results[j].publishedDate).getTime() < selectedDate.getTime()) {
                    articleList[j].classList.add('hidden');
                }
            }
        }
    }

    function handleCloseOverlay() {
        closeModal();
    }

    init();

})(window, document);
