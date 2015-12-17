datepicker = (function (window, document) {

    'use strict';

    var days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
    var months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    var years = [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016];
    var datepickerContainer;
    var selectDays;
    var selectMonths;
    var selectYears;

    function init(elementId) {
        datepickerContainer = document.getElementById(elementId);

        selectDays = createSelect(days, 'days');
        selectMonths = createSelect(months, 'months');
        selectMonths.onchange = selectMonthHandler;
        selectYears = createSelect(years, 'years');

        datepickerContainer.appendChild(selectDays);
        datepickerContainer.appendChild(selectMonths);
        datepickerContainer.appendChild(selectYears);
    }

    function createSelect(values, type) {
        var optionList = '<option>--</option>';
        var select = document.createElement('select');
        select.setAttribute('class', 'datepicker-' + type);

        for (var i = 0; i < values.length; i++) {
            optionList += '<option val="' + values[i] + '">' + values[i] + '</option>';
        }

        select.innerHTML += optionList;

        return select;
    }

    function enableAllOptions() {
        for (var i = 0; i < selectDays.children.length; i++) {
            selectDays.children[i].classList.remove('hidden');
        }
    }

    function selectMonthHandler() {

        var selectedValue = selectMonths.options[selectMonths.selectedIndex].value;
        enableAllOptions();

        switch (selectedValue) {
            case '1': //january
                break;
            case '2': //february
                if(isLeapYear()){
                    selectDays.children[29].classList.add('hidden');
                }
                selectDays.children[30].classList.add('hidden');
                selectDays.children[31].classList.add('hidden');
                break;
            case '3': //march
                break;
            case '4': //april
                selectDays.children[31].classList.add('hidden');
                break;
            case '5': //may
                break;
            case '6': //june
                selectDays.children[31].classList.add('hidden');
                break;
            case '7': //july
                break;
            case '8': //august
                break;
            case '9': //september
                selectDays.children[31].classList.add('hidden');
                break;
            case '10'://october
                break;
            case '11'://november
                selectDays.children[31].classList.add('hidden');
                break;
            case '12'://december
                break;
        }
    }

    function isLeapYear(year) {
        return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
    }

    return {
        init: init
    };

})(window, document);
