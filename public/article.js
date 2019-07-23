$(document).ready(function () {


    $(document.body).on("click", ".save", function () {
        $.ajax({
            method: "PUT",
            url: `/save/${$(this).attr("data-id")}`
        }).then(article => {
            console.log(article);
            $(this).text(article.saved ? "Unsave" : "Save");
        });
    });


});