var startTime = Date.now();
var availableToday = false;
var availableThisWeek = false;

// https://stackoverflow.com/questions/15397372/javascript-new-date-ordinal-st-nd-rd-th
var getOrdinal = function (dayNr) {

    var ordinal = '';

    if (dayNr > 3 && dayNr < 21) {

        ordinal = 'th';
    } else {
        //
        ordinal = {
            '1': 'st',
            '2': 'nd',
            '3': 'rd'
        }[parseInt(dayNr + '') + ''];

        if (!ordinal) {

            ordinal = 'th';
        }
    }

    return ordinal;
};

var attemptUtagLink = function (category, action, label, callback) {

    if (window && window.utag && window.utag.link && typeof window.utag.link === 'function') {

        window.utag.link({

            'event_category': category,

            'event_action': action,

            'event_label': label
        }, callback);
    } else {

        if (callback && typeof callback === 'function') {

            callback();
        }
    }
};

if (!window.variantName) {

    window.variantName = 'Variant A';
}

if (!window.versionName) {

    window.versionName = 'Version 1';
}
//
// panatda
//Parse query params and generate an object of key value pairs from the query params.
// Source: StackOverflow
// https://stackoverflow.com/questions/4656843/jquery-get-querystring-from-url
function getUrlVars() {
    var vars = {};
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        var hash = hashes[i].split('=');
        vars[hash[0]] = hash[1];
    }
    return vars;
}

// Capture the query params as an object
var queryParams = getUrlVars();

var providerFilter;


if (queryParams['search-term'] && queryParams['search-term'] === "Primary+Care+Providers") {
    providerFilter = "Primary Care";
    console.log("Found the primary Care");
}
if (queryParams['search-term'] && queryParams['search-term'] === "Pediatrician") {
    providerFilter = "Pediatrician";
    console.log("Found the Pediatrician");
}

// end

var secondaryOptionCount = 2;

var months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

var defaultProfileImageF = 'http://cm.swedish.org/swedish-physicians/images/F-no-photo.png';

var defaultProfileImageM = 'http://cm.swedish.org/swedish-physicians/images/M-no-photo.png';

var getProviderDisplayHtml = function (provider, time, showMoreButton, showBanner) {

    var ratingNr = parseFloat(provider['reviewScore'] + '');

    var ratingStr = '';

    var jobTitle = provider['jobTitle'] ? provider['jobTitle'] : '';

    for (var i = 1; i <= 5; i++) {

        if (i <= ratingNr) {

            ratingStr += '<i class="material-icons star-rating__item"></i>'
        } else {

            var percentPercent = Math.ceil(ratingNr % 1 * 10 / 3) * .1;

            if (percentPercent) {

                percentPercent += .3;
            }

            ratingStr += '<i class="material-icons star-rating__item" style="width: ' + percentPercent + 'em"></i>';

            break;
        }
    }
    // TODO ADD Kyrus ID / use Profile
    var drLink = provider['profileUrl'];

    var acceptingNewPatients = provider['acceptingNewPatients'] === true;

    var displayDateObj = new Date(time);

    var nextAppointmentText = '<span class="calender-icon"> <img src="https://s3-us-west-2.amazonaws.com/wheelhouse-clients/swedish/images/calendar-icon.jpg" alt="calender icon" width="25"></span> <span>Next Opening For New Patients: </span></strong> <span class="appointment-time">' + months[displayDateObj.getMonth()] + ' ' + displayDateObj.getDate() + getOrdinal(displayDateObj.getDate()) + '</span>';

    var bookingLink = 'https://nassau.provinnovate.com/scheduling/providers/' + provider['npi'] + '/family-practice/new/who';

    var bookingText = 'BOOK NEW PATIENT';




    return htmlElement = '' +

        '<div class="wh-container">' +
        '<div class="wh-widget-border">' +

        (showBanner ?

            '<div class="book-online-now flex-row">' +

            '<span class="book-online-text">New Patient?  See a Provider ' + ((availableToday) ? 'Today:' : (availableThisWeek) ? 'This Week:' : 'Next Week:') + '</span>' +

            '</div>' :
            '') +
        '<div class="wh-modal-border result-container" itemscope="itemscope" itemtype="https://schema.org/Physician">' +

        '<div class="height-spacer-15"></div>' +

        '<div class="result-container-flex">' +

        '<div class="result-provider-photo-wrapper profile-photo' + (acceptingNewPatients ? ' profile-photo--captioned' : '') + '">' +

        '<div class="profile-photo__image">' +

        '<a href="' + provider['profileUrl'] + '">' +
        // TODO change default image to gender based once gender is in api.
        '<img src="' + ((provider['image'] || 'UNLISTED') !== 'UNLISTED' ? provider['image'] : defaultProfileImageM) + '" ' +
        // Assumes name is existant and valid.
        'class="result-provider-photo" alt="Photo of ' + provider['name'] + '" ' +

        'onerror="this.onerror=null;this.src=\'http://cm.swedish.org/swedish-physicians/images/M-no-photo.png\';" ' +

        'onload="this.style[\'height\'] = \'\';this.style[\'visibility\'] = \'\';" />' +

        '</a>' +

        '</div>' +

        (acceptingNewPatients ?

            '<div class="profile-photo__caption hidden-phone">' +

            '<div>' +

            '<span class="dig-icon-group mrg-right-8 v-align-text-bottom">' +

            '<i class="dig-icon-checkmark-1"></i>' +

            '<i class="dig-icon-checkmark-2"></i>' +

            '</span>' +

            '<span class="align-left" style="display: inline-block; width: calc(100% - 40px)">Accepting New Patients</span>' +

            '</div>' +

            '</div>' +
            // TODO lookup and check if set to false for non accepting new patients.
            '<meta itemprop="isAcceptingNewPatients" content="true" />'

            :
            '') +

        '</div>' +

        '<div class="result-provider-content-container">' +

        '<div class="flex-row">' +

        '<div class="result-provider-name" itemprop="name">' +

        '<a href="' + drLink + '">' + provider['name'] + '</a>' +

        '</div>' +

        '</div>' +

        '<div class="height-spacer-10 hide-desktop"></div><div class="height-spacer-8 hide-tablet"></div>' +

        '<div class="flex-row">' +

        '<div class="result-provider-jobtitle">' +

        '<div class="mdc-typography--body2">' + jobTitle + '</div>' +

        '<div class="height-spacer-10 hide-tablet"></div>' +

        '</div>' +

        '</div>' +

        '<div class="flex-row">' +

        (ratingNr ?

            '<div class="rating-row">' +

            '<span class="star-rating">' +

            '<span class="star-rating__inner">' +

            '<span class="star-rating__layer-group">' +

            '<span class="star-rating__layer">' +

            '<i class="material-icons star-rating__item"></i>' +

            '<i class="material-icons star-rating__item"></i>' +

            '<i class="material-icons star-rating__item"></i>' +

            '<i class="material-icons star-rating__item"></i>' +

            '<i class="material-icons star-rating__item"></i>' +

            '</span>' +

            '<span class="star-rating__layer star-rating__layer--overlay">' +

            ratingStr +

            '</span>' +

            '</span>' +

            '</span>' +

            '<div class="height-spacer-10 hide-desktop"></div><div class="height-spacer-8 hide-tablet"></div>' +

            '<span class="star-rating__label">' +

            '<span>' + ratingNr + ' out of 5</span>' +

            '</span>' +

            '</span>' +

            '</div>'

            :
            '') +

        '</div>' +

        (provider['address'] && provider['address']['facility'] && provider['address']['facility'] !== 'UNLISTED' ?

            '<div class="height-spacer-10 hide-desktop"></div><div class="height-spacer-8 hide-tablet"></div>' +

            '<div class="flex-row provider-facility">' +

            '<span class="provider-facility">' + provider['address']['facility'] + '</span>' +

            // '<div class="result-specialties-label">Specialties</div>' +
            //
            // '<div class="result-specialties-list">' +
            //
            //     '<div class="result-specialties-list">' +
            //
            //         '<div class="result-specialty-level-1">' +
            //
            //             '<span itemprop="medicalSpecialty">' + provider['specialties'] + '</span>' +
            //
            //         '</div>' +
            //
            //     '</div>' +
            //
            // '</div>' +

            '</div>'

            :
            '') +

        '</div>' +

        '</div>' +

        '<div class="height-spacer-15"></div>' +

        (showMoreButton ?

            '<div class="mdc-layout-grid__inner grid-gap-6 featured">' +

            '<div class="margin-bottom-10  mdc-layout-grid__cell mdc-layout-grid__cell--span-12-desktop mdc-layout-grid__cell--span-8-tablet mdc-layout-grid__cell--span-4-phone mdc-layout-grid__cell--align-top">' +

            '<div class="stub-divider"></div>' +

            '<div class="container"><div class="row"><div class="col-xs-12">' +

            '<span class="next-appointment-text">' + nextAppointmentText + '</span> ' +

            '</div></div></div>' +

            '</div>' +

            '</div>'


            :
            '') +

        '<div class="container">' +
        '<div class="row">' +
        '<div class="provider-booking-availability">' +

        (showMoreButton ? '' : '<div class="col-xs-12"><div class="stub-divider"></div><span class="next-appointment-text mb-15">' + nextAppointmentText + '</span></div>') +

        '<div class="col-xs-12' + (showMoreButton ? ' col-sm-6' : '') + '"><a href="' + bookingLink + '" class="booking-link options-element" title="Book Now" target="_blank">' + bookingText + '</a></div> ' +

        (showMoreButton || '') +

        '</div>' +

        '</div>' +

        '</div>' +

        '</div>' +

        '</div>' +

        '<div class="height-spacer-20"></div>';
};

var loopDocumentReady = function () {

    try {

        (jQuery || $)(document).ready(function ($) {
            // Should use set...
            var npiNumbers = {};

            $('.npi-number').each(function () {

                npiNumbers[$(this).data('doctor-npi')] = true;
            });
            
            $.ajax('https://odhp-api.wheelhousedmg.com/get/allby?brand=Swedish&getSched=true&odhp=true')

                .success(function (resp) {

                    if (resp && resp.length && Array.isArray(resp)) {

                        // var nextBestList = {};

                        // var currentBest = {};

                        var inTwoHours = Date.now() + (1000 * 60 * 60 * 2);

                        // var currentBestValidTime = 0;
                        // map of {location > {best provider, provider time}}
                        // Need to ensure same provider isn't listed on two locations?
                        var bestPerLocation = {};
                        
                        var provider = null;

                        var currentBestFacilityName = null;

                        var currentBestTime = null;

                        for (var index in resp) {

                            if (resp.hasOwnProperty(index) && resp[index]) {

                                provider = resp[index];

                                // panatda
                                // If you have a providerFilter set from earlier,
                                // Inspect the provider object for some sort of 'type' attribute which would indicate if that doctor is a "Primary Care" or "Pediatrician" depending on which providerFilter you set.

                                // If the provider is not the desired type of doctor, 'continue' and skip to the next doctor. You dont

                                if (providerFilter && provider.jobTitle.indexOf(providerFilter) == -1) {
                                    continue;
                                }
                               
                                // Potentially add filter for accepting new patients, etc.
                                if (provider['isActive'] && provider['isActive'] === true && !npiNumbers[provider['npi']]) {

                                    //check to make sure cache is less than 140 minutes
                                    var timeStamp = provider['timestamp'];

                                    if (provider['timeslots'] && timeStamp < 140) {

                                        for (var i = 0; i < provider['timeslots'].length; i++) {

                                            var timeslot = Date.parse(provider['timeslots'][i].split('*')[0]);
                                            
                                            //  Allegedly after slot x, if it's > current best, won't have valid, could potentially skip after.
                                            if (timeslot && timeslot >= inTwoHours) // && (!currentBestValidTime || currentBestValidTime > timeslot))
                                            {

                                                // Should consider moving this outside the for loop
                                                if (provider && provider['address'] && provider['address']['facility']) {

                                                    var provFacility = provider['address']['facility'];

                                                    if (!bestPerLocation[provFacility]) {

                                                        bestPerLocation[provFacility] = [];
                                                    }
                                                    // Intentionally goes to length, inserts if out of bounds.
                                                    for (var j = 0; j <= bestPerLocation[provFacility].length; j++) {
                                                        // Assume comparison to object in 'time' is valid
                                                        if (!bestPerLocation[provFacility][j] || bestPerLocation[provFacility][j]['time'] > timeslot) {
                                                            // Stores the time integer here so we don't have to parse for every comparison
                                                            // Inserts at  the location, pushing anything that was at the location behind.
                                                            bestPerLocation[provFacility].splice(j, 0, {
                                                                'time': timeslot,
                                                                'provider': provider,
                                                                'facility': provFacility
                                                            });
                                                            // Assumes this should only ever trigger on one location.
                                                            if (!currentBestTime || currentBestTime > timeslot) {

                                                                currentBestFacilityName = provFacility;

                                                                currentBestTime = timeslot;
                                                            }

                                                            break;
                                                        }
                                                    }
                                                    // Breaks from loop aas timeslot was valid and provider should have been added.
                                                    // Assumes slotx < slotx+1
                                                    break;
                                                } else {
                                                    // Not having a facility disqualifies.  Again, should be moved outside of loop.
                                                    break;
                                                }
                                            } else {


                                            }
                                        }
                                    }
                                } else {

                                    // isntActive += 1;
                                }
                            }
                        }

                        // Determine if displayDateObject is same as todays date, within the next week, or further out than that.
                        var numDaysBetween = function (d1, d2) {
                            var diff = Math.abs(d1.getTime() - d2.getTime());
                            return diff / (1000 * 60 * 60 * 24);
                        };
                        // Get today's date
                        var todaysDate = new Date();
                        var copiedDate = new Date(currentBestTime);
                        // call setHours to take the time out of the comparison
                        if (copiedDate.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0)) {
                            availableToday = true;
                        } else if (numDaysBetween(copiedDate, todaysDate) < 8) {
                            availableThisWeek = true;
                        }
                        // This might be getting out of hand.
                        if (currentBestFacilityName && bestPerLocation[currentBestFacilityName] && bestPerLocation[currentBestFacilityName][0] && bestPerLocation[currentBestFacilityName][0]['provider'] && bestPerLocation[currentBestFacilityName][0]['provider']['isActive'] && currentBestTime) {

                            var secondaryOptions = [];

                            var numDuplicatesAllowed = secondaryOptionCount - Object.keys(bestPerLocation).length;

                            if (numDuplicatesAllowed < 0) {

                                numDuplicatesAllowed = 0;
                            }
                            // This is almost o(n^3)
                            for (var facilityName in bestPerLocation) {
                                // :|
                                if (bestPerLocation.hasOwnProperty(facilityName) && bestPerLocation[facilityName]) {

                                    var lastIndex = 0;

                                    for (var i = (facilityName === currentBestFacilityName ? 1 : 0); i < bestPerLocation[facilityName].length && numDuplicatesAllowed >= i; i++) {

                                        for (var j = lastIndex; j <= secondaryOptions.length; j++) {

                                            if (!secondaryOptions[j] || secondaryOptions[j]['time'] > bestPerLocation[facilityName][i]['time']) {

                                                secondaryOptions.splice(j, 0, bestPerLocation[facilityName][i]);
                                                // Doesn't check against current item.
                                                lastIndex = j + 1;

                                                break;
                                            }
                                        }
                                    }
                                }
                            }

                            var usedFacilityNames = new Set([currentBestFacilityName]);

                            for (var i = 0; i < secondaryOptions.length; i++) {

                                if (usedFacilityNames.has(secondaryOptions[i]['facility'])) {

                                    if (numDuplicatesAllowed > 0) {
                                        // TODO consider using numDuplicatesAllowed-- on if instead
                                        numDuplicatesAllowed--;
                                    } else {

                                        secondaryOptions.splice(i, 1);
                                        // Re-attempts same index with new value;
                                        i -= 1;
                                    }
                                } else {

                                    usedFacilityNames.add(secondaryOptions[i]['facility']);
                                }
                            }

                            secondaryOptions = secondaryOptions.splice(0, secondaryOptionCount);

                            var htmlElement = getProviderDisplayHtml(bestPerLocation[currentBestFacilityName][0]['provider'], currentBestTime, secondaryOptions.length ? '<div class="col-xs-12 col-sm-5"><a id="showMoreButton" class="options-element" href="#">SEE MORE AVAILABILITY</a></div>' : '', true);

                            $('.row').parent().prepend(htmlElement);

                            if (secondaryOptions.length) {

                                var secondariesHtml = '';

                                for (var i = 0; i < secondaryOptions.length; i++) {

                                    secondariesHtml += getProviderDisplayHtml(secondaryOptions[i]['provider'], secondaryOptions[i]['time'], '', false);
                                }

                                $('#container').append('<div id="wh-modal" class="modal dk-mb-15"><div class="modal-content"><span class="modal-header"><div class="container"><div class="row"><div class="col-xs-12"><span class="modal-close">&times;</span></div><div class="col-xs-12"><span class="header-text">New Patient?  See a Provider ' + ((availableToday) ? 'Today' : (availableThisWeek) ? 'This Week' : 'Next Week') + ':</span></div></div></div></span > ' + secondariesHtml + '</div ></div > ');

                                $('#showMoreButton, .modal-close').on('click', function (event) {

                                    event.preventDefault();

                                    console.log("clicking");

                                    $('.modal').toggleClass('open');

                                    var showMoreButton = $('#showMoreButton');

                                    if (showMoreButton.length && event.target === showMoreButton[0]) {

                                        attemptUtagLink('Schedule Appointment', 'Featured Result - Click', showMoreButton.text(), function () {

                                            var cutoffTime = Date.now() + 1000 * 60;

                                            var attemptLoadedCheck = function () {

                                                if ($('.modal.open').length) {

                                                    // console.log('attempting utag');

                                                    attemptUtagLink('Schedule Appointment', 'Featured Result Modal - Loaded', window.versionName, function () {


                                                    });
                                                } else {

                                                    if (Date.now() < cutoffTime) {
                                                        // TODO figure out timing for this.
                                                        setTimeout(attemptLoadedCheck, 100);
                                                    }
                                                }
                                            };

                                            attemptLoadedCheck();
                                        });
                                    }
                                });

                                var modal = document.getElementById('wh-modal');

                                window.onclick = function (event) {

                                    if (event.target == modal) {

                                        $('.modal').removeClass('open');
                                    }
                                }
                            }

                            $('.booking-link.options-element').on('click', function (event) {

                                var $this = this;

                                event.preventDefault();

                                attemptUtagLink('Schedule Appointment', 'Primary Care Booking Start', $(this).text(), function () {

                                    window.location.href = $($this).attr('href');
                                });
                                // If the request takes too long, move before.
                                // TODO consider changing time.
                                setTimeout(function () {

                                    window.location.href = $($this).attr('href')
                                }, 500);
                            });

                            attemptUtagLink('Schedule Appointment', 'Featured Result Loaded - ' + window.variantName, bestPerLocation[currentBestFacilityName][0]['provider']['name'], function () {


                            });
                        }
                    } else {

                        console.log('no valid response', resp);
                    }
                })

                .error(function (err) {

                    console.log(err);
                });
        });
    } catch (e) {
        console.log("caught the error");
        if (e instanceof ReferenceError) {
            // Don't continue the loop if more than 2 mins waiting for doc ready
            if (startTime + (1000 * 60 * 2) > Date.now()) {

                setTimeout(loopDocumentReady, 50);
            }
        }
    }
};

loopDocumentReady();