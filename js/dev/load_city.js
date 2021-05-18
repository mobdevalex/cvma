//https://stackoverflow.com/questions/45007712/bootstrap-4-dropdown-with-search
//Initialize with the list of symbols
//let names_city = []

let names_city = [];


let typingTimer;                //timer identifier
let doneTypingInterval = 200;  //time in ms (2 seconds)

$('#city_dropdown').on('input', function () {

    clearTimeout(typingTimer);

    typingTimer = setTimeout(function () {

        // doSomething...
        loadCity();

    }, doneTypingInterval);
});



function loadCity() {

    $.post({
        // async: false,
        // global: false,
        dataType: 'json',
        url: "/ajax/city",

        data: {
            country: $('#countrySelect option:selected').val(),
            search: $('#city_dropdown').val(),
        },

        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },

        'success': function (data) {

            buildDropDownCity(data)
        }
    });
}


//Find the input search box
let search_city = document.getElementById("city_dropdown")

//Find every item inside the dropdown
let items_city = document.getElementsByClassName("dd-city")

function buildDropDownCity(values) {
    let contents = []
    for (let name of values) {

        var region = name.region ? ' (' + name.region + ')' : '';

        contents.push('<input type="button" class="dropdown-item dd-city" type="button" value="' + name.city + ' ' + region + '" data-city="' + name.city + '" data-region="' + name.region + '">')
    }

    $('#menuItems-city').html('');
    $('#menuItems-city').append(contents.join(""))

    //Hide the row that shows no items were found
    $('#empty-city').hide()
}

//Capture the event when user types into the search box
window.addEventListener('input', function () {

    if (search_city) {
        filterCity(search_city.value.trim().toLowerCase());
    }
});

//For every word entered by the user, check if the symbol starts with that word
//If it does show the symbol, else hide it
function filterCity(word) {
    let length = items_city.length
    let collection = []
    let hidden = 0
    for (let i = 0; i < length; i++) {
        if (items_city[i].value.toLowerCase().startsWith(word)) {
            $(items_city[i]).show()
        }
        else {
            $(items_city[i]).hide()
            hidden++
        }
    }

    //If all items are hidden, show the empty view
    if (hidden === length) {
        $('#empty-city').show()
    }
    else {
        $('#empty-city').hide()
    }
}

//If the user clicks on any item, set the title of the button as the text of the item
$('#menuItems-city').on('click', '.dd-city', function () {
    $('#dropdown_city').text($(this)[0].value)
    $("#dropdown_city").dropdown('toggle');

    //add to hidden
    $('input[name=dropdown_region]').val($(this).attr('data-region'));
    $('input[name=dropdown_city]').val($(this).attr('data-city'));

    // set city  ( + region  if needed )
    setNewCityAndRegion($(this).attr('data-city'), $(this).attr('data-region'));


    // activate search
    if( $('#search_vacancy').length > 1 ){

        $('#search_vacancy').trigger("input")
    }

    //console.log($(this).attr('data-city'));
})

function setNewCityAndRegion(city, region) {

    $.post({
        // async: false,
        // global: false,
        dataType: 'json',
        url: "/ajax/set-city-region",

        data: {
            //country: $('#countrySelect option:selected').val(),
            city: city,
            region: region,
            set_city: $('#dropdown_city_set').val()
        },

        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },

        'success': function (data) {

            //maybe alert?

            if($('#city_id').length > 0){

                $('#city_id').val(data).change();

                console.log('sdfds')
            }
        }
    });
}
