$(document).ready(function () {
    var CountryOptions = '';
    var districtOptions = '';
    var supdistrictOptions = '';
    $.getJSON('Country/Country.json', function (data) {
        CountryOptions += '<option value="">Davlat nomi</option>';
        $.each(data, function (key, Country) {
            CountryOptions += '<option value="' + Country.id + '">' + Country.name + '</option>';
        });
        $('#Country').html(CountryOptions);
    });
    $(document).on('change', '#Country', function () {
        var Country_id = $(this).val();
        if (Country_id != '') {
            $.getJSON('Country/District.json', function (data) {
                districtOptions = '<option value="">Mintaqa(viloyat)ni tanlang</option>';
                $.each(data, function (key, district) {
                    if (Country_id == district.Country_id) {
                        districtOptions += '<option value="' + district.id + '">' + district.name + '</option>';
                    }
                });
                $('#district').html(districtOptions);
            });
        } else {
            $('#district').html('<option value="">Mintaqa(viloyat)ni tanlang</option>');
            $('#subdistrict').html('<option value="">Select Sub-District</option>');
        }
    });
    $(document).on('change', '#district', function () {
        var district_id = $(this).val();
        if (district_id != '') {
            $.getJSON('Country/Subdistrict.json', function (data) {
                supdistrictOptions = '<option value="">Tuman / Shaharni tanlang</option>';
                $.each(data, function (key, subdistrict) {
                    if (district_id == subdistrict.district_id) {
                        supdistrictOptions += '<option value="' + subdistrict.id + '">' + subdistrict.name + '</option>';
                    }
                });
                $('#subdistrict').html(supdistrictOptions);
            });
        } else {
            $('#subdistrict').html('<option value="">Tuman / Shaharni tanlang</option>');
        }
    });
});