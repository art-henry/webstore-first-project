$( function() {

    var fromInput = $('input[name="fromValue"]'),
        toInput = $('input[name="toValue"]'),
        range = $( "#slider-range" );

    function changeMinMaxVal(event, ui) {
        var firsthandle = range.slider( "option" ,"firsthandle").find('.min-value'),
            secondhandle =    range.slider( "option" ,"secondhandle").find('.max-value');

        $(firsthandle).text(ui.values[ 0 ]+'$' );
        $(secondhandle).text(ui.values[ 1 ]+'$' );
        fromInput.attr('max', ui.values[ 1 ]);
        toInput.attr('min', ui.values[ 0 ]);

    }

    function onCreateRange(event, ui) {
        var state = range.slider( "option" ),
            target = $(event.target),
            handles = target.find('.ui-slider-handle'),
            firsthandle = $(handles[0]),
            secondhandle =  $(handles[1]),
            fromInput = $('input[name="fromValue"]'),
            toInput = $('input[name="toValue"]');

        range.slider( "option" ,"firsthandle", firsthandle );
        range.slider( "option" ,"secondhandle", secondhandle );

        fromInput.attr('max', state.max);
        toInput.attr('max', state.max);

        firsthandle.append('<span class="min-value">'+ state.values[0] +'$</span>');
        secondhandle.append('<span class="max-value">'+ state.values[1] +'$</span>');

    }


    range.slider({
        range: true,
        min: 0,
        max: 1100,
        values: [ 100, 1000 ],
        create: onCreateRange,
        slide: changeMinMaxVal,
        change: changeMinMaxVal
    });




    fromInput.on('keyup', function (e) {

        var values = range.slider( "option", "values");
        $(this).attr('max', values[1]);
        toInput.val( +this.value + 1);
        range.slider( "option", "values", [ this.value, values[1] ] );

    });

    toInput.on('keyup', function (e) {

        var values = range.slider( "option", "values");
        $(this).attr('min', values[0]);
        range.slider( "option", "values", [ values[0] , this.value ] );

    })

    // flexslider init
    $(window).load(function() {
        $('.flexslider').flexslider({
            animation: "slide",
            controlNav: "thumbnails"
        });
    });

    // formstyler init
    $('.custom-number').styler();


});
document.querySelector("#slider-range > span:nth-child(2)")
