$(document).ready(function(){


 
  $("#owl-demo").owlCarousel({
 
      items: 1,
        loop: true,
        autoplay:true,
        dotsEach:2,
        dots:false,
        nav:true,
        autoplayTimeout:5000,
        autoplaySpeed:800,
        smartSpeed:800,
        navigation: true,
  navText: ["Anterior","Siguiente"]
 
  });
 


  $('[data-toggle="tooltip"]').tooltip();
  $(".nav-item").children().first().trigger("click");
    /*$('.modal').modal({
        dismissible: true, // Modal can be dismissed by clicking outside of the modal
        opacity: .5, // Opacity of modal background
        inDuration: 300, // Transition in duration
        outDuration: 200, // Transition out duration
        startingTop: '4%', // Starting top style attribute
        endingTop: '10%', // Ending top style attribute
        ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
          //alert("Ready");
          //console.log(modal, trigger);
        },
        complete: function() {
            //SOLO PARA EL CASO DE MODALES QUE DEJEN UN TR CON CLASE ACTIVE
            var tr = $("table").find("tr.active");
            if(tr!=null){
                if(tr.length>0){
                    //tr = tr[0];
                    $(tr).removeClass("active");
                }
            }
        } // Callback for Modal close
      }
    );
    
    $('#modTasasDetalle').modal({
        dismissible: true, // Modal can be dismissed by clicking outside of the modal
        opacity: .5, // Opacity of modal background
        inDuration: 300, // Transition in duration
        outDuration: 200, // Transition out duration
        startingTop: '4%', // Starting top style attribute
        endingTop: '10%', // Ending top style attribute
        ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.

        },
        complete: function() {

        } // Callback for Modal close
      }
    );*/
 
    
    //FRAMEWORK DE DEFINICION REGLAS CSS A TRAVES DE PROPIEDADES DE ELEMENTOS
    //var ElementQueries = require('ElementQueries');

    // attaches to DOMLoadContent and does anything for you
    //ElementQueries.listen();

    // or if you want to trigger it yourself:
    // 'init' parses all available CSS and attach ResizeSensor to those elements which
    // have rules attached (make sure this is called after 'load' event, because
    // CSS files are not ready when domReady is fired.
    // Use this function if you have dynamically created HTMLElements
    // (through ajax calls or something)
    //ElementQueries.init();
});

var AJAX = [];

$(document).keyup(function (e) {
    if($(".btnToastAceptar").length>0 && (e.keyCode == 13)){
        $(".btnToastAceptar").first().click();
    }else if ($(".frmFiltros").length>0 && (e.keyCode == 13)) {
        if($(".frmFiltros").find("button.btnBuscar").length>0){
            $(".frmFiltros").find("button.btnBuscar").first().click();
        }
    }else if ($("input:not(.autocomplete)").is(":focus") && (e.keyCode == 13)) {
        var formulario = $("input:focus").parents("form");//console.log(formulario);
        var button = formulario.find(".divEnviar")[0];
        formulario = formulario[0];
        if($(formulario).attr("validation-function")!=null && $(formulario).attr("validation-function").toString().trim().length>0){
            try{
                eval($(formulario).attr("validation-function"));
            } catch(err) {
                console.log(err);alerta("OCURRIO UN ERROR EN EL SISTEMA, REVISE");
            }
        }else{
            if($(button).css("display")!="none"){
                enviarForm($(formulario).attr("id"),$(button).attr("id"));
            }else{
                mensajeToast("UN MOMENTO","Debe esperar que termine de cargar los campos.");
            }
        }
    }
});


$( document ).ajaxStart(function() {
    //console.log($(this));
});

$( document ).ajaxStop(function() {
    $(".material-tooltip").remove();
    $('.tooltipped').tooltip({delay: 50});   
    $("tr").dblclick(function (){
        var availableDetails = $(this).attr("available-details");
        if(availableDetails!=null){
            if(availableDetails=="true"){
                var data = $(this).attr("data-details");
                if(data!=null){
                    if(data.toString().trim().length>0){
                        try {
                            $(this).parents("tbody").children("tr.active").removeClass("active");
                            $(this).addClass("active");
                            data = decodeURIComponent(data);
                            data = JSON.parse(data);
                            var html = "";
                            $(data).each(function (key,val){
                                html = html + "<tr>";
                                $(val).each(function (key2,val2){
                                    html = html + "<td>" + val2 + "</td>";
                                });
                                html = html + "</tr>";
                            });
                            $("#tbodyDetallesRegistro").html(html);
                            $("#modDetallesTabla").modal('open');
                        } catch(err) {
                            console.log(err);alerta("OCURRIO UN ERROR EN EL SISTEMA, REVISE");
                        }
                    }
                }
            }
        }
    });
});

function autocomplete(inp, arr, funcionEjecutar, claseEspecial) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      a.classList.add(claseEspecial);
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      //for (i = 0; i < arr.length; i++) {
      for (var key in arr) {
        /*check if the item starts with the same letters as the text field value:*/
        if (key.substr(0, val.length).toUpperCase() == val.toUpperCase() ) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + key.substr(0, val.length) + "</strong>";
          b.innerHTML += key.substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' data-elemento='"+arr[key]+"' value='" + key + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              funcionEjecutar(this.getElementsByTagName("input")[0].dataset.elemento);
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }else if(key.toUpperCase().includes(val.toUpperCase())){
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          var posini = key.toUpperCase().indexOf(val.toUpperCase());
          b.innerHTML = key.substr(0,posini);
          b.innerHTML += "<strong>" + key.substr(posini, val.length) + "</strong>";
          b.innerHTML += key.substr(posini + val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' data-elemento='"+arr[key]+"' value='" + key + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              funcionEjecutar(this.getElementsByTagName("input")[0].dataset.elemento);
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
}

function alerta(texto,tiempo,modo,funcion){
    if(tiempo==null){
        tiempo=((texto.length)/8)*1000;
    }
    if(modo==null){
        modo="info";
    }
    if(funcion==null){
        funcion = function(){};
    }
    if(tiempo<10000){
        tiempo = 10000;
    }
    $.notify({
        message: texto
    },{
        type: modo,
        delay: "10000",
        onClose: funcion,
        /*placement: {
            from: "top",
            align: "center"
	},*/
        /*template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
		'<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
		'<span data-notify="icon"></span> ' +
		'<span data-notify="title">{1}</span> ' +
		'<span data-notify="message">{2}</span>' +
		'<div class="progress" data-notify="progressbar">' +
			'<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
		'</div>' +
		'<a href="{3}" target="{4}" data-notify="url"></a>' +
	'</div>',*/
    });
}

function alert(texto){
    alerta(texto);
}
function AlertaEliminar(contenido,url,parametros,ejecutar){
    alertaToast("ADVERTENCIA",contenido,"enviarURL('"+url+"','"+parametros+"','"+ejecutar+"');");
}

function AlertaForm(formulario,contenido,fnCancelar){
    if(fnCancelar==null){
        fnCancelar = "";
    }
    var fnValidacion = $("#"+formulario).attr("validation-function");
    alertaToast("ADVERTENCIA",contenido,fnValidacion,fnCancelar);
}

function AlertaFuncion(contenido,funcion){
    alertaToast("ADVERTENCIA",contenido,funcion);
}

var timeToast = 300000;

function cerrarToast(toast){
    $(toast).fadeOut(1000);
    setTimeout(function (){ 
        $(toast).remove();
        if($("#toast-container").children().length==0){$("#toast-container").removeClass("z-depth-5");}
    },500);
}

function mensajeToast(titulo,contenido,modo){
    if(titulo.toString().length==0){
        titulo = "INFORMACION";
    }
    var d = new Date();
    var tieini = d.getTime();
    var temp = contenido+'<input class="iptToastMensaje" type="hidden" value="'+tieini+'">';
    try{
        contenido = decodeURIComponent(contenido);
    } catch (e) {
        console.log(e);
        contenido = temp;
    }
    if(modo==null){
        modo="info";
    }
    $.notify({
	title: titulo,
        message: contenido,
    },{
        type: modo,
        delay: "10000",
    });
}

function alertaToast(titulo,contenido,funcion,funcionCancelar){
    if(funcionCancelar==null){
        funcionCancelar = "";
    }
    contenido = decodeURIComponent(contenido);
    /*Materialize.toast('<div class="" style="width:100%;"><div class="row toastHeader"><h2>'+titulo+'</h2></div><div class="row toastContent"><div class="col s12"><p class="center">'+contenido+'</p></div><div class="col s12 center"><div class="col s6"><div class=""><button class="btn btnToastAceptar" onclick="$(this).parent().parent().parent().parent().parent().parent().remove();'+funcion+'">ACEPTAR</button></div></div><div class="col s6"><div class=""><button class="btn btnToastCancelar" onclick="cerrarToast($(this).parent().parent().parent().parent().parent().parent());'+funcionCancelar+'">CANCELAR</button></div></div></div></div></div>', timeToast, '', 'if($("#toast-container").children().length==0){$("#toast-container").removeClass("z-depth-5");}');
    $(".toast").each(function(key,val){
        $(val).css("padding","0px");
        $(val).css("width","100%");
        $(val).addClass("z-depth-5");
    });
    $("#toast-container").css("display","block");
    $("#toast-container").removeClass("z-depth-5");
    $("#toast-container").addClass("z-depth-5");*/
    var notificacion = $.notify({
	title: titulo,
        message: contenido
    },{
        type: "warning",
        delay: timeToast,
	//timer: 1,
        //onClose: funcion,
        placement: {
            from: "top",
            align: "center"
	},
        template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
		'<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
		'<span data-notify="icon"></span> ' +
		'<span data-notify="title" style="font-weight:700;">{1}</span><br> ' +
		'<span data-notify="message">{2}</span>' +
		'<div class="progress" data-notify="progressbar">' +
			'<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
		'</div>' +
		'<div style="padding-top:10px;"><button type="button" class="btn btn-success" onclick="'+funcion+'" data-notify="dismiss" style="float:left;font-size:0.8rem;line-height:1;" onclick=""><i class="fa fa-check"></i> Aceptar</button>'+
                '<button type="button" style="float:right;font-size:0.8rem;line-height:1;" onclick="'+funcionCancelar+'" class="btn btn-danger" data-notify="dismiss"><i class="fa fa-times"></i> Cancelar</button></div>' +
	'</div>',
    });
    console.log($(notificacion));
}

var cargando = '<div style="position: relative;left: 50%;"><div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div></div>';

function redireccionar(vista, parametros){
    $("#divPrincipal").html('<div class="center" style="height:80%;">'+cargando+'</div>');
    $(".material-tooltip").html("");
    if($("#btnOpciones").css("overflow")=="visible"){
        $("#btnOpciones").trigger("click");
    }
    var ajax_function = $.ajax({
        async:true,    
        cache:false,
        type: 'GET',
        url: vista,
        data: parametros,
        success: function (data, textStatus, jqXHR) {
            $("#divPrincipal").html(data);
            $('.tooltipped').tooltip({delay: 50});
        },
        beforeSend: function (xhr) {
            $(".material-tooltip").remove();
        }
    });
    //AJAX.push(ajax_function);
}

var ruta_array = [];

function setActiveClass(item){
    $(".aSubmenus").each(function(key,val){
        $(val).removeClass("active");
    });
    $(item).addClass("active");
}

function recargar(pos,url){
    var nuevo_array = [];
    $(ruta_array).each(function (key,val){
        if(key<pos){
            nuevo_array.push(val);
        }
    });
    ruta_array = nuevo_array;
    actualizarRuta();
    redireccionar(url);
}

function recargarPorURL(url,parametros){
    var nuevo_array = [];
    var valido = true;
    $(ruta_array).each(function (key,val){
        if(val[0].includes(url)){
            valido = false;
        }
        if(valido){
            nuevo_array.push(val);
        }
    });
    ruta_array = nuevo_array;
    actualizarRuta();
    if(parametros.toString().length>0){
        redireccionar(url+"?"+parametros);
    }else{
        redireccionar(url);
    }
}

function enviarForm(form,button){
    var boton = $("#"+button).html();
    $("#"+button).html(cargando);
    var formData = new FormData(document.getElementById(form));
    var ajax_function = $.ajax({
        /*async:true,    
        cache:false,
        contentType: false,
        processData: false,
        type: 'POST',
        url: $("#"+form).attr("action"),
        data: $("#"+form).serialize(),*/
        type: "POST",
        url: $("#"+form).attr("action"),
        data: formData,
        contentType:false,
        processData: false,
        cache:false,
        success: function (data, textStatus, jqXHR) {
            try {
                var json = JSON.parse(data);
                var correcto = json.correcto;
                var url = json.url.toString();
                if(!correcto){
                    mensajeToast('ERROR',json.error);
                }else{
                    if(json.mensaje!=null && json.mensaje.toString().trim().length>0){
                        mensajeToast('',json.mensaje);
                    }
                }
                var ejecutar = json.ejecutar;
                if(ejecutar!=null && ejecutar.toString().trim().length>0){
                    eval(ejecutar);
                    console.log(ejecutar);
                }
                if(url.trim().length>0){
                    window.location = url;
                }else{
                    if(correcto && $("#modTasasDetalle").length>0 && $("#modTasasDetalle").hasClass("open")){
                        $("#modTasasDetalle").modal("close");
                    }else{
                        var vista = json.vista;
                        var parametros = json.parametros;
                        if(vista.trim().length>0){
                            recargarPorURL(vista,parametros);
                        }else{
                            $("#"+button).html(boton);
                        }
                    }
                }
            } catch(err) {
                console.log(err);alerta("OCURRIO UN ERROR EN EL SISTEMA, REVISE");
            }
        },
        beforeSend: function (xhr) {

        }
    });
    //AJAX.push(ajax_function);
}

function enviarURL(url,parametros,ejecutar){
    var ajax_function = $.ajax({
        async:true,    
        cache:false,
        type: 'POST',
        url: url,
        data: parametros,
        success: function (data, textStatus, jqXHR) {
            try{
                var json = JSON.parse(data);
                var correcto = json.correcto;
                var url = json.url.toString();
                if(!correcto){
                    mensajeToast('ERROR',json.error);
                }else{
                    mensajeToast('',json.mensaje);
                }
                if(url.trim().length>0){
                    window.location = url;
                }else{
                    var vista = json.vista;
                    var parametros = json.parametros;
                    if(vista.trim().length>0){
                        recargarPorURL(vista,parametros);
                    }else{
                        if(ejecutar!=null){
                            eval(ejecutar);
                        }
                    }
                }
            } catch(err) {
                console.log(err);alerta("OCURRIO UN ERROR EN EL SISTEMA, REVISE");
            }
        },
        beforeSend: function (xhr) {

        }
    });
    //AJAX.push(ajax_function);
}

function agregarRuta(nuevo,nombre,url){
    if(nuevo){
        ruta_array = [];
    }
    ruta_array.push([url,nombre]);
    actualizarRuta();
}

function actualizarRuta(){
    var array_actual = ruta_array;
    $("#lstSecuencia").html("");
    ruta_array = [];
    $(array_actual).each(function (key,val){
        $("#lstSecuencia").append('<a href="#!" onclick="recargar(\''+key+'\',\''+val[0]+'\');" class="breadcrumb">'+val[1]+'</a>');
        ruta_array.push(val);
    });
}

function agregarOpciones(opciones){
    var colores = ["red","yellow darken-4","green","blue","purple","orange","deep-purple","cyan","teal","light-blue","pink","lime","light-green","amber","deep-orange","brown","grey"];
    $("#ulOpciones").html("");
    var opciones_html = "";
    $(opciones).each(function (key,val){
        var color = colores[Math.floor((Math.random() * colores.length))];
        opciones_html = opciones_html + '<li><a class="pointer btn-floating '+color+' tooltipped" data-html="true" data-position="left" data-delay="50" data-tooltip="'+val[2]+'" onclick="redireccionar(\''+val[0]+'\',\'\')"><i class="material-icons white-text">'+val[1]+'</i></a></li>';
    });
    $("#ulOpciones").html(opciones_html);
    $('.tooltipped').tooltip({delay: 50});
}

function cargarTabla_JSON(formulario,tTable,columnas,jsonDataAjax){
    try{
        $('#'+tTable).DataTable({
            destroy: true,
            language: {
                url: "/vendor/datatables/Spanish.json",
                select: {
                    rows: {
                        _: "- %d registros seleccionados",
                        1: "- 1 registro seleccionado"
                    }
                }
            },
            lengthMenu: [ [10, 25, 50, -1], [10, 25, 50, "Todos"] ],
            pageLength: 10,
            searching: false,
            order: [/*[ 0, 'asc' ], [ 1, 'asc' ]*/],
            processing: true,
            serverSide: true,
            autoWidth: false,
            colReorder: true,
            select: {
                style: 'os',
                className: 'row-selected',
                blurable: true,
                info: true,
            },
            columns: columnas,
            ajax: {
                url: $("#"+formulario).attr("action"),
                type: 'GET',
                data: jsonDataAjax,
                dataFilter: function(data){
                    var json = jQuery.parseJSON( data );
                    json.recordsTotal = json.n;
                    json.recordsFiltered = json.n;
                    json.data = json.datos;
         
                    return JSON.stringify( json ); // return JSON string
                }
                //"dataType": "jsonp"
            },
            drawCallback: function(settings){
              $('#'+tTable+' [data-toggle="tooltip"]').tooltip();
            }
        });

        //$('#'+tTable).select.style( 'os' );
    } catch(err) {
        console.log(err);alerta("OCURRIO UN ERROR EN EL SISTEMA, REVISE");
    }
}

function cargarTabla_JSON2(formulario,tBody,divPaginacion,href){
    $("#"+tBody).empty().html('<tr><td colspan="100"><div class="center">'+cargando+'</div></td></tr>');
    $("#"+divPaginacion).empty();
    var url = "";
    var data = "";
    if(formulario.toString().length>0){
        url = $("#"+formulario).attr("action");
        data = $("#"+formulario).serialize();
    }
    if(href!=null){
        url = href;
        data = "";
    }
    var ajax_function = $.ajax({
        async:true,    
        cache:false,
        type: "GET",   
        url: url,
        data: data, 
        success:  function(a){
            try{
                if(a!=null){
                    a = JSON.parse(a);
                    var html = '';
                    var tabla = a.datos;
                    var detalles = a.detalles;
                    var npag = Number(a.npag);
                    var href = a.href;
                    var clases = a.clases;
                    var styles = a.styles;
                    var Npaginas = Number(a.Npaginas);
                    var Npaginacion = Number(a.Npaginacion);
                    var Nlateral = Number((Npaginacion%2==0)?(Npaginacion/2):((Npaginacion-1)/2));
                    if(tabla.length>0){
                        $(tabla).each(function (key,val){
                            html = html + '<tr ';
                            if(clases!=null){
                                html = html + clases[key];
                            }else if(styles!=null){
                                html = html + ' style="'+styles[key]+'"';
                            }
                            if(detalles!=null){
                                html = html + ' available-details="true" data-details="'+detalles[key]+'"';
                            }
                            html = html + '>';
                            $(val).each(function (key2,val2){
                                html = html + '<td>'+val2+'</td>';
                            });
                            html = html + '</tr>';
                        });
                        $("#"+tBody).html(html);
                        $("#"+tBody).addClass("pointer");
                        html = '';
                        html = html + '<div class="col s12">';
                        html = html + '    <ul class="pagination center">';
                        html = html + '      <li>';
                        if(npag>1){
                            html = html + '<a href="#" onclick="cargarTabla_JSON(\'\',\''+tBody+'\',\''+divPaginacion+'\',\''+href+'npag='+(npag-1).toString()+'\')"><i class="material-icons">chevron_left</i></a>';
                        }else{
                            html = html + '<a class="disabled"><i class="material-icons">chevron_left</i></a>';
                        }
                        html = html + '      </li>';
                        var begin = 0;
                        var end = 0;
                        if(Npaginas<=Npaginacion){ begin = 1;
                        }else{ if(npag-Nlateral<1){ begin = 1;
                        }else{ if(npag-Nlateral>Npaginas-Npaginacion+1){ begin = Npaginas-Npaginacion+1;
                        }else{ begin = npag-Nlateral;}}}
                        if(Npaginas<=Npaginacion){ end = Npaginas;
                        }else{ if(npag+Nlateral<Npaginacion){ end = Npaginacion;
                        }else{ if(npag+Nlateral>Npaginas){ end = Npaginas;
                        }else{ end = npag+Nlateral;}}}
                        for (var i=begin; i<=end; i++){
                            html = html + '<li class="';
                            if(npag == i){
                                html = html + 'active';
                            }else{
                                html = html + 'waves-effect';
                            }
                            html = html + '"><a href="#" onclick="cargarTabla_JSON(\'\',\''+tBody+'\',\''+divPaginacion+'\',\''+href+'npag='+i+'\')">'+i+'</a></li>';
                        }
                        html = html + '      <li>';
                        if(npag < Npaginas){
                            html = html + '<a href="#" onclick="cargarTabla_JSON(\'\',\''+tBody+'\',\''+divPaginacion+'\',\''+href+'npag='+(npag + 1).toString()+'\')"><i class="material-icons">chevron_right</i></a>';
                        }else{
                            html = html + '<a class="disabled"><i class="material-icons">chevron_right</i></a>';
                        }
                        html = html + '    </ul>';
                        html = html + '</div>';
                        $("#"+divPaginacion).html(html);
                        $('.tooltipped').tooltip({delay: 50});
                    }else{
                        $("#"+tBody).empty().html('<tr><td colspan="100">No se encontro ninguna coincidencia</td></tr>');
                    }
                }else{
                    window.location='/';
                }
            } catch(err) {
                console.log(err);alerta("OCURRIO UN ERROR EN EL SISTEMA, REVISE");
            }
        },
        beforeSend:function(){},
        error:function(objXMLHttpRequest){}
    });
    //AJAX.push(ajax_function);
}

function comprobarAjaxPendientes(ejecutar){
    setTimeout(function (){
        if(jQuery.active>0){
            comprobarAjaxPendientes(ejecutar);
        }else{
            eval(ejecutar);
        }
    },1000);
}

function selectAJAX_JSON(url,parametros,label,propID,propOption,div,name,id,seleccionado,funcion,todos,ejecutar,bloquear,arrayMostrar,classSelect){
    if(seleccionado==null || seleccionado.trim().length==0){
        seleccionado = "0";
    }
    if(classSelect==null || classSelect.trim().length==0){
        classSelect = "";
    }
    $("#"+div).empty().html('<div class="center">'+cargando+'<input type="hidden" name="'+name+'" value="'+seleccionado+'"></div>');
    var optionTodos = "";
    if(todos==null){
        todos=true;
        optionTodos = '(TODOS)';
    }else{
        if(typeof(todos)=="string"){
            optionTodos = todos;
            todos=true;
        }else{
            optionTodos = '(TODOS)';
        }
    }
    //console.log(bloquear);
    if(bloquear!=null){
        $(bloquear).each(function (key,val){
            //console.log(val);
            $("#"+val).hide();
        });
    }
    var ajax_function = $.ajax({
        async:true,    
        cache:false,
        type: 'GET',   
        url: url,
        data: parametros, 
        success:  function(a){
            try{
                a = JSON.parse(a);
                //console.log(a);
                var html = '';
                if(label!=null && label.length>0){
                    html = html + '<label for="'+id+'">'+label+'</label>';
                }
                html = html + '<select class="form-control form-control-sm '+classSelect+'" name="'+name+'" id="'+id+'"  onchange="'+funcion+'">';
                var cantidad = 0;
                if(todos){
                    html = html + '<option value="0">'+optionTodos+'</option>';
                }
                var dataMostrar = '';
                var js2 = '';
                if(arrayMostrar!=null){
                    var js2 = 'dataMostrar = ';
                    $(arrayMostrar).each(function (key2,val2){
                        js2 = js2 + "val."+val2+"+'|'+";
                    });
                    js2 = js2 + "'';";
                }
                $(a).each(function (key,val){
                    cantidad++;
                    //html = html + '<option value="'+val.Id+'" ';
                    try{
                        eval(js2);
                    } catch(err) {
                        console.log(err);
                        console.log(js2);
                        dataMostrar = "";
                    }
                    dataMostrar = encodeURI(dataMostrar);
                    eval("html = html + '<option value=\"'+val."+propID+"+'\" data_mostrar=\"'+dataMostrar+'\" ';");
                    eval("if(seleccionado==val."+propID+"){html = html + ' selected=\"\"';}");
                    //html = html + '>'+val.Abreviatura+'</option>';
                    eval("html = html + '>'+val."+propOption+"+'</option>';");
                });
                html = html + '</select>';
                $("#"+div).empty().html(html);
                //$("select").select2();
                if(ejecutar!=null){
                    eval(ejecutar);
                }
                if(bloquear!=null){
                    var mostrar='';
                    $(bloquear).each(function (key,val){
                        mostrar = mostrar + '$("#'+val+'").show();';
                    });
                    comprobarAjaxPendientes(mostrar);
                }
            } catch(err) {
                console.log(err);alerta("OCURRIO UN ERROR EN EL SISTEMA, REVISE");
            }
        },
        beforeSend:function(){},
        error:function(objXMLHttpRequest){}
    });
    //AJAX.push(ajax_function);
}

var pad = "00000000";

function autocompleteAJAX_JSON(url,parametros,label,propID,propOption,div,name,id,funcionClick,funcionBlur,claseEspecial,ejecutar,bloquear,placeholder){
    $("#"+div).empty().html('<div class="center">'+cargando+'</div>');
    if(bloquear!=null){
        $(bloquear).each(function (key,val){
            //console.log(val);
            $("#"+val).hide();
        });
    }
    if(placeholder==null){
        placeholder = "";
    }
    $.ajax({
        async:true,    
        cache:false,
        type: 'GET',   
        url: url,
        data: parametros, 
        success:  function(a){
            try{
                a = JSON.parse(a);
                //console.log(a);
                var html = '';
                if(label!=null && label.length>0){
                    html = html + '<label for="'+id+'">'+label+'</label>';
                }
                html = html + '<input class="form-control form-control-sm autocomplete-input" type="text" autocomplete="off" name="'+name+'" id="'+id+'" onblur="'+funcionBlur+'" last_selected="" placeholder="'+ placeholder +'">';
                $("#"+div).empty().html(html);
                var datos = '';
                var js = 'var datos = {';
                $(a).each(function (key,val){
                    var dataMostrar = '';
                    var js2 = 'var dataMostrar = ';
                    $(propID).each(function (key2,val2){
                        js2 = js2 + "val."+val2+"+'|'+";
                    });
                    js2 = js2 + "'';";
                    eval(js2);
                    dataMostrar = dataMostrar.substring(0, dataMostrar.length - 1);
                    eval("js = js + '\"'+"+propOption+"+'\": \"'+dataMostrar+'\",';");
                });
                js = js + '};';
                eval(js);
                //console.log(datos);
                //$("#"+id).autocomplete({data: datos},funcionClick,claseEspecial);
                autocomplete(document.getElementById(id),datos,funcionClick,claseEspecial);
                if(ejecutar!=null){
                    eval(ejecutar);
                }
                if(bloquear!=null){
                    var mostrar='';
                    $(bloquear).each(function (key,val){
                        mostrar = mostrar + '$("#'+val+'").show();';
                    });
                    comprobarAjaxPendientes(mostrar);
                }
            } catch(err) {
                console.log(err);alerta("OCURRIO UN ERROR EN EL SISTEMA, REVISE");
            }
        },
        beforeSend:function(){},
        error:function(objXMLHttpRequest){}
    });
}

function limpiarAutocomplete(inptTxt,inptHdd,spanClear){
    $("#"+inptTxt).val("");
    $("#"+inptTxt).attr("last_selected","");
    $("#"+inptHdd).val("0");
    $(spanClear).parent().removeClass("select-wrapper");
    $("#"+inptTxt).prop("readonly",false);
    $(spanClear).remove();
    $("#"+inptTxt).focus();
}

function activeLabels(){
    $("label").each(function (key,val){
        var id_input = $(val).attr("for");
        if(id_input!=null){
            if(($("#"+id_input).attr("type")=="text" || $("#"+id_input).attr("type")=="number" || $("#"+id_input).attr("type")=="password") && $("#"+id_input).val().toString().trim().length>0){
                $(val).addClass("active");
            }
        }
    });
}

function modalTasas(modo,idcomptipopoli,eliminar){
    if(eliminar==null){
        eliminar = false;
    }
    var titulo = "";//console.log(modo);
    if(modo=="COMISION"){
        titulo = "DETALLE DE LAS COMISIONES";
    }else{
        titulo = "DETALLE DE LAS PRIMAS NETAS";
    }//console.log(titulo);
    $("#h2Cabecera").html(titulo);
    $("#divContenido").html(cargando);
    $("#modTasasDetalle").modal('open');
    var ajax_function = $.ajax({
        async:true,    
        cache:false,
        type: 'GET',
        url: "modalTasas.php",
        data: "modo="+modo+"&id_compania_tipopoliza="+idcomptipopoli+"&eliminar="+eliminar,
        success: function (data, textStatus, jqXHR) {
            $("#divContenido").html(data);
        },
        beforeSend: function (xhr) {
        }
    });
}

function download(parametros){
    window.location="../controlador/contDocumento.php?funcion=descargarFormato&"+parametros;
}

function imprimir(idsolicitud){
    $.ajax({
        async:true,    
        cache:false,
        type: 'GET',
        url: "../controlador/contImprimir.php?accion=ImprimirVenta",
        data: "id_solicitud="+idsolicitud,
        success: function (data, textStatus, jqXHR) {
            alert("Imprimiendo");
        },
        beforeSend: function (xhr) {
        }
    });
}

var tiposDocumento = {"0":"SIN DOC.","1":"DNI","4":"CARNET EXT.","6":"RUC","7":"PASAPORTE"};

var afectacionesIGV = {"10":["GRAVADO","btn-success"],"20":["EXONERADO","btn-warning"],"30":["INAFECTO","btn-danger"]};

function modalMantenimiento(url,param){
    $("#modalMantenimientoContenido").html(cargando);
    $('#modalMantenimiento').modal('show');
    $("#divModDialg").attr("class","modal-dialog");
    $.ajax({
        type: 'GET',
        data: param,
        url: url,
        success: function (data) {
            $("#modalMantenimientoContenido").html(data);
        }
    });
}

function enviarCorreoCliente(idsol,idsolser){
    $.ajax({
        async:true,    
        cache:false,
        type:'POST',
        url:"controlador/contCliente.php?funcion=enviarCorreo",
        data: "id_solicitud="+idsol+"&id_solicitud_servidor="+idsolser,
        success: function (data){
            data = JSON.parse(data);
            alerta(data.mensaje);
        }
    });
}

function number_format(number, decimals, dec_point, thousands_sep) {
  // *     example: number_format(1234.56, 2, ',', ' ');
  // *     return: '1 234,56'
  number = (number + '').replace(',', '').replace(' ', '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function(n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.round(n * k) / k;
    };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}

function crearGraficoLineas(divPanel){
    var ctx = document.getElementById(divPanel);
    var myLineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
        datasets: [
          {
            label: "Ingresos",
            lineTension: 0.3,
            backgroundColor: "rgba(78, 115, 223, 0.05)",
            borderColor: "rgba(78, 115, 223, 1)",
            pointRadius: 3,
            pointBackgroundColor: "rgba(78, 115, 223, 1)",
            pointBorderColor: "rgba(78, 115, 223, 1)",
            pointHoverRadius: 3,
            pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
            pointHoverBorderColor: "rgba(78, 115, 223, 1)",
            pointHitRadius: 10,
            pointBorderWidth: 2,
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          }
          /*,{
            label: "Ingreso2",
            lineTension: 0.3,
            backgroundColor: "rgba(78, 115, 223, 0.05)",
            borderColor: "rgba(78, 115, 223, 1)",
            pointRadius: 3,
            pointBackgroundColor: "rgba(78, 115, 223, 1)",
            pointBorderColor: "rgba(78, 115, 223, 1)",
            pointHoverRadius: 3,
            pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
            pointHoverBorderColor: "rgba(78, 115, 223, 1)",
            pointHitRadius: 10,
            pointBorderWidth: 2,
            data: [0, 0, 3, 0, 0, 5, 0, 0, 0, 0, 0, 0],
          }*/
        ],
      },
      options: {
        maintainAspectRatio: false,
        layout: {
          padding: {
            left: 10,
            right: 25,
            top: 25,
            bottom: 0
          }
        },
        scales: {
          xAxes: [{
            time: {
              unit: 'date'
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            ticks: {
              maxTicksLimit: 7
            }
          }],
          yAxes: [{
            ticks: {
              maxTicksLimit: 10,
              padding: 10,
              // Include a dollar sign in the ticks
              callback: function(value, index, values) {
                return 'S/ ' + number_format(value,2,'.','');
              }
            },
            gridLines: {
              color: "rgb(234, 236, 244)",
              zeroLineColor: "rgb(234, 236, 244)",
              drawBorder: false,
              borderDash: [2],
              zeroLineBorderDash: [2]
            }
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          backgroundColor: "rgb(255,255,255)",
          bodyFontColor: "#858796",
          titleMarginBottom: 10,
          titleFontColor: '#6e707e',
          titleFontSize: 14,
          borderColor: '#dddfeb',
          borderWidth: 1,
          xPadding: 15,
          yPadding: 15,
          displayColors: false,
          intersect: false,
          mode: 'index',
          caretPadding: 10,
          callbacks: {
            label: function(tooltipItem, chart) {
              var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
              return datasetLabel + ': S/' + number_format(tooltipItem.yLabel,2,'.','');
            }
          }
        }
      }
    });
    return myLineChart;
}

function crearGraficoCircular(divPanel){
    var ctx = document.getElementById(divPanel);
    var myPieChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ["Facturas", "Boletas", "Notas de Crédito", "Notas de Débito", "Anulados"],
        datasets: [{
          data: [1, 1, 1, 1, 1],
          backgroundColor: ['#4e73df', '#1cc88a', '#f6c23e', '#36b9cc','#e74a3b'],
          hoverBackgroundColor: ['#2e59d9', '#17a673', '#d4a735', '#2c9faf', '#c54135'],
          hoverBorderColor: "rgba(234, 236, 244, 1)",
        }],
      },
      options: {
        maintainAspectRatio: false,
        tooltips: {
          backgroundColor: "rgb(255,255,255)",
          bodyFontColor: "#858796",
          borderColor: '#dddfeb',
          borderWidth: 1,
          xPadding: 15,
          yPadding: 15,
          displayColors: false,
          caretPadding: 10,
        },
        legend: {
          display: false
        },
        cutoutPercentage: 80,
      },
    });
    return myPieChart;
}