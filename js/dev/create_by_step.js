$(document).on("click hover", '#cmd_creare_by_step', function () {

    //console.log('check')

    if(isLoggedIn() === true){

        window.location.href = '/new_profile';
    }
});