$(document).ready(function () {

    var articleId;

    $("#title").text("SAVED ARTICLES");
    $("#subtitle").text("READ THEM AGAIN & AGAIN");

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

        $(element).parent().children(".card-footer").prepend(noteBtn);

        // var articleId = $(element).closest(".card").attr("data-id");

        // $(".modal").attr("data-id", articleId);
    });

    $(document.body).on("click", ".addNote", function () {
        $("#notes").empty();
        var id = $(this).closest(".card").attr("data-id");
        articleId = id;
        $.ajax({
            method: "GET",
            url: `/comment/${id}`
        }).then(article => {
            if (!article.comments) return;
            article.comments.forEach(comment => {
                let p = $("<p>")
                    .text(comment.body)
                    .css("float", "left");

                let item = $("<li>")
                    .addClass("list-group-item");

                item.append(p);

                let deleteNote = $("<button>")
                    .addClass("deleteNote btn btn-light")
                    .html("&#10006")
                    .attr("data-note-id", comment._id)
                    .css("float", "right");

                item.append(deleteNote);

                $("#notes").append(item);
            });
        });
    });

    $(document.body).on("click", "#saveNote", function () {
        $.ajax({
            method: "POST",
            url: `/comment/${articleId}`,
            data: {
                body: $("#noteInput").val()
            }
        });
    });

    $(document.body).on("click", ".deleteNote", function () {
        var noteId = $(this).attr("data-note-id");
        $.ajax({
            method: "DELETE",
            url: `/comment/${noteId}`
        }).then(res => {
            if (res === "OK") {
                $(this).parent().remove();
            } else {
                prompt("Unable to delete note");
            }
        });
    });

    $('#myModal').on('hidden.bs.modal', function () {
        $("#noteInput").val(null);
    })

});