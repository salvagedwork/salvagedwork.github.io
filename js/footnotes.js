// Footnote script from https://www.milania.de/blog/Automatic_footnote_generation_with_jQuery

$(document).ready(function () {                                         // Proceed further when all necessary information is loaded
    var ctnFootnotesGlobal = 1;

    $("article div.entry").each(function () {                           // Handle each article individually
        var ctnFootnotes = 1;                                           // Counter for the footnotes inside the current article
        $(this).find("span.footnote").each(function () {                // Traverse through each footnote element inside the article
            var id = "ftn_" + ctnFootnotesGlobal + "_" + ctnFootnotes;  // Automatic id generation for the links
            var html = $(this).html();                                  // Content of the footnote element (contains the footnote text)

            if (ctnFootnotes === 1) {
                //$(this).parents(".entry").append("<hr />");             // Add a horizontal line before the first footnote after the article text (only for the article where the span element is located)
            }

            $(this).html("<sup><a style='text-decoration: none;' href='#" + id + "'>" + ctnFootnotes + "</a></sup>");                                  // Add the footnote number to the text
            $(this).parents(".entry").append("<sup id='" + id + "'>" + ctnFootnotes + ". " + html + "</sup><br />");    // Add the footnote text to the bottom of the current article

            /* Show tooltip on mouse hover (http://www.alessioatzeni.com/blog/simple-tooltip-with-jquery-only-text/) */
            $(this).hover(function () {               // Hover in
                var $tooltip = $("<p class='tooltip'></p>");
                $tooltip.html(html).appendTo("body").fadeIn("slow");        // Add paragraph
                MathJax.Hub.Queue(["Typeset", MathJax.Hub, $tooltip[0]]);   // Re-run MathJax typesetting on the new element
            }, function () {                          // Hover out
                $(".tooltip").fadeOut().remove();     // Remove paragraph
            }).mousemove(function (e) {               // Move the box with the mouse while still hovering over the link
                var mouseX = e.pageX + 20;            // Get X coordinates
                var mouseY = e.pageY + 10;            // Get Y coordinates
                $(".tooltip").css({top: mouseY, left: mouseX});
            });

            ctnFootnotes++;
            ctnFootnotesGlobal++;
        });
    });
});