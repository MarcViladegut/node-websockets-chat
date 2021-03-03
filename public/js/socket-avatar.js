
var elementSelected = null;
var typeSelected = false;

sessionStorage.removeItem('avatar')

$(document).on('click', '.list-image > img', function(){
    $('.list-image > img').each(function(){
        $(this).removeClass('active');
        sessionStorage.removeItem('avatar')
    })
    $(this).addClass('active');
    elementSelected = $(this);
    var src = elementSelected.attr('src')
    sessionStorage.setItem('avatar', src)
    typeSelected = false;
});