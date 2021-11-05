$(document).ready(function () {
    var divisionOptions = '';
    var districtOptions = '';
    var supdistrictOptions = '';
    $.getJSON('Country/Division.json', function (data) {
        divisionOptions += '<option value="">Davlat nomi</option>';
        $.each(data, function (key, division) {
            divisionOptions += '<option value="' + division.id + '">' + division.name + '</option>';
        });
        $('#division').html(divisionOptions);
    });
    $(document).on('change', '#division', function () {
        var division_id = $(this).val();
        if (division_id != '') {
            $.getJSON('Country/District.json', function (data) {
                districtOptions = '<option value="">Mintaqa(viloyat)ni tanlang</option>';
                $.each(data, function (key, district) {
                    if (division_id == district.division_id) {
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