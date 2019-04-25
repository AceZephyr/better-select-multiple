var _bsm_options = {}

function _bsm__put(id, a) {
    var selection_name = $("<p class='bsm__selection-name'>").text(a.name)
    var selection_remove = $("<p class='bsm__selection-remove'>").html("&times;").click(function() {
        var url_name = $(this).parent().val()
        $(`#${id} option[value=${url_name}]`).attr({"selected": false})
        $(this).parent().remove()
    })
    var selection_display = $("<div class='bsm__selection-display'>").val(a.url_name)
    selection_display.append(selection_name)
    selection_display.append(selection_remove)
    $(`#_bsm__selected__${id}`).append(selection_display)
}

function make_bsm(select_multiple_id) {
    if (typeof select_multiple_id !== "string") {
        return;
    }
    if (Object.keys(_bsm_options).includes(select_multiple_id)) {
        return;
    }
    var e = $(`#${select_multiple_id}`)
    if (e.length < 1) {
        return;
    }
    e.addClass("bsm__hidden")
    var opts = []
    e.find("option").each(function (index) {
        opts.push({
            "name": $(this).text(),
            "url_name": $(this).val()
        })
    })
    _bsm_options[select_multiple_id] = opts
    var d = $(`<div>`).attr({"id": `_bsm__container__${select_multiple_id}`})
    d.append($("<div>").addClass("bsm__selected").attr({"id": `_bsm__selected__${select_multiple_id}`}))
    d.append($("<input>").attr({"id": `_bsm__selector__${select_multiple_id}`}).on("keydown", function(event) {if (event.keyCode==13) event.preventDefault()}).autocomplete({
        minLength: 0,
        source: function(request, response) {
            var id = $(this)[0].element[0].id.match(new RegExp("^_bsm__selector__(.*)$"))[1]
            response($.ui.autocomplete.filter(_bsm_options[id].map(x => x.name), $(this.element[0]).val()))
        },
        select: function(event, ui) {
            var id = $(this)[0].id.match(new RegExp("^_bsm__selector__(.*)$"))[1]
            var a = _bsm_options[id].filter(x => x.name == ui.item.value)[0]
            var opt = $(`#${id} option[value=${a.url_name}]`)
            if (!opt.attr("selected")) {
                opt.attr("selected", true)
                _bsm__put(id, a)
            }
            this.value = ""
            event.preventDefault()
        }
    }))
    e.after(d)
    e.find("option[selected]").each(function(index, element) {
        _bsm__put(select_multiple_id, {"name": $(element).text(), "url_name": $(element).val()})
    })
}