/* Plugin */
$(document).ready(function() {
    cargardatos();
});

// modal agregar 
function agregar() {
    $("#form").modal("show");
    $('#form-content').html("Cargando...")
    $.get('./modalAgregar.html')
        .then((data) => {
            $('#form-content').html(data)

        })
        .fail((error) => {
            console.log(error)
        })
}

function aceptar(tipo) {
    let url = ''
    let type = ""
    $(".insert").attr('disabled', 'disabled').text('Cargando...')
    if (tipo == 'editar') {
        const id = $('#rolID').val()
        url = 'https://rest-soft1.herokuapp.com/roles/actualizar/' + id
        type = "put"
    } else if (tipo == 'agregar') {
        url = 'https://rest-soft1.herokuapp.com/roles/agregar'
        type = "post"
    }

    const descripcion = $('#descripcion').val();
    const data = { descripcion: descripcion }

    $.ajax({
        url: url,
        type: type,
        data: JSON.stringify(data),
        dataType: 'json',
        contentType: 'application/json',
        success: function(retorno) {
            // location.reload();
            $("#form").modal("hide");
            alert('Operación Exitosa.')
            cargardatos()
            location.reload();
            $(".insert").prop('disabled', false).text('Aceptar')
        },
        error: function(e) {
            console.log(e)
            alert("se ha producido un error");
            $(".insert").prop('disabled', false).text('Aceptar')
        }
    });

}
// LA FUNCION EDITAR CAMPO OPTINE EL ATTRIBUTO DATA-JSON LA FILA DE LA TABLA Y LO COMBIERTE EN OBJETO PARA PORDER RENDERIZAR 
function editarCampo(element) {
    const obj = JSON.parse($(element).attr('data-json'))
        //console.log(obj)
    const id = obj.rolID
    const descripcion = obj.descripcion

    $("#form").modal("show");
    $('#form-content').html("Cargando...")

    $.get('./modalEdit.html')
        .then((data) => {
            // console.log(data)
            $('#form-content').html(data)
            $('#rolID').val(id)
            $('#descripcion').val(descripcion)
        })
        .fail((error) => {
            console.log(error)
        })
}

/* Eliminar */
function eliminar() {
    const id = $("#rolID").val();
    $.ajax({
        url: "https://rest-soft1.herokuapp.com/roles/eliminar/" + id,
        type: "DELETE",
        dateType: "JSON",
        success: function(retorno) {
            location.reload();
        },
        error: function() {
            alert("se ha producido un error");
        },
        alert: function() {
            alert(retorno);
        },
    });
}

function deletefunction(id) {
    $("#rolID").val(id);
    /*  $('#btn-del').append(
            '<a href="https://rest-soft1.herokuapp.com/categoria/eliminar' + id + '" class="btn btn-success">Eliminar</a>'); */
    $("#delete").modal("show");
}

/* Tuplas */
function cargardatos() {
    $("#content").html("");
    var cuerpoCat = document.getElementById("content");
    var fila = "";
    $.ajax({
        url: "https://rest-soft1.herokuapp.com/roles",
        data: {},
        type: "GET",
        dateType: "JSON",
        success: function(retorno) {
            console.log(retorno);
            if (retorno) {
                // como se recibia del ajax un string, se pudo parsea a un objeto, la funcion es Json.parse()
                const arrayRetorno = JSON.parse(retorno);

                // for: recorre un array
                for (let index = 0; index < arrayRetorno.length; ++index) {
                    const element = arrayRetorno[index];
                    //     console.log("estoy aqui", element)
                    fila += `
                        <tr Class="table table-success" style="text-align:left ;"> 
                            <td>${ element.rolID }</td>
                            <td>${ element["descripcion"] }</td>
                            <td> 
                                <button data-json='${ JSON.stringify(element) }' onclick="editarCampo(this)" class="editarCampo btn btn-outline-info text-uppercase font-weight-bold mr-2">
                                    <i class="icon-edit"></i>Editar
                                </button>
                                <a href="javascript:deletefunction(${ element["rolID"] })" class="btn btn-outline-danger text-uppercase font-weight-bold ml-2">
                                    <i class="icon-cancel">
                                    </i>Eliminar
                                </a>
                            </td>
                        </tr>
                    `
                }

                $("#content").append(fila);
                $("#datatable_plug").DataTable();

            }
            /* location.reload(); */
        },
        error: function() {
            alert("se ha producido un error");
        },
        alert: function() {
            alert(retorno);
        },
    });
    //}
}