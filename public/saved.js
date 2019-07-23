$(document).ready(function () {

    $(document.body).on("click", ".save", function () {
        $(this).closest(".card").remove();
    });

    $(".card-body").each((_i, element) => {
        let btnStyle = {
            width: "100%",
            backgroundColor: "blue"
        };
        let noteBtn = $("<button>")
            .addClass("addNote btn btn-dark btn-sm my-1")
            .attr("data-toggle", "modal")
            .attr("data-target", "#myModal")
            .css(btnStyle)
            .text("Notes");
        $(element).append(noteBtn);

        var articleId = $(element).closest(".card").attr("data-id");

        $(".modal").attr("data-id", articleId);
    });

    $(document.body).on("click", ".addNote", function () {
        $("#notes").empty();
        var articleId = $(this).closest(".card").attr("data-id");
        $.ajax({
            method: "GET",
            url: `/comment/${articleId}}`
        }).then(article => {
            console.log(article);
            if (!article.comments) return;
            article.comments.forEach(comment => {
                console.log(1);
                let p = $("<p>");
                p.text(comment.body);

                let item = $("<li>")
                    .addClass("list-group-item");

                item.append(p);

                $("#notes").append(item);
            });
        });
    });

    $(document.body).on("click", "#saveNote", function () {
        var articleId = $(".modal").attr("data-id");
        $.ajax({
            method: "POST",
            url: `/comment/${articleId}`,
            data: {
                body: $("#noteInput").val()
            }
        });
    });

});