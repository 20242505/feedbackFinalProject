
// ==========================================
// 1. CONFIGURACIÓN
// ==========================================

const API_URL = "comentarios.php";
const DEMO_MODE = false;

let comentarios = [
    {
        nombre: "María",
        comentario: "Viendo la clase."
    },
    {
        nombre: "Jorge",
        comentario: "Probando el sistema."
    }
];

// ==========================================
// 2. SELECCIONAR ELEMENTOS DEL HTML
// ==========================================

const form = document.querySelector("#commentForm");
const nombre = document.querySelector("#nombre");
const comentario = document.querySelector("#comentario");
const charCount = document.querySelector("#charCount");
const commentCount = document.querySelector("#commentCount");
const commentsList = document.querySelector("#commentsList");
const submitBtn = document.querySelector("#submitBtn");
const message = document.querySelector("#message");

// ==========================================
// 3. CONTADOR DE CARACTERES
// ==========================================

comentario.addEventListener("input", () => {

    charCount.textContent =
        `${comentario.value.length} / 500 caracteres`;

});

// ==========================================
// 4. MENSAJES DE CONFIRMACIÓN Y ERROR
// ==========================================

function mostrarMensaje(texto, tipo) {

    message.textContent = texto;
    message.className = `alert alert-${tipo} mt-3 mb-0`;

}

// ==========================================
// 5. MOSTRAR COMENTARIOS
// ==========================================

function mostrarComentarios(lista) {

    commentsList.replaceChildren();

    commentCount.textContent =
        `${lista.length} comentarios`;

    if (lista.length === 0) {

        const aviso = document.createElement("p");

        aviso.className = "text-secondary text-center py-4";
        aviso.textContent = "Todavía no hay comentarios.";

        commentsList.appendChild(aviso);

        return;
    }

    lista.forEach(item => {

        // Crear tarjeta Bootstrap

        const card = document.createElement("article");

        card.className =
            "card border-0 shadow-sm rounded-3 mb-3 comment-card";

        // Cuerpo de la tarjeta

        const cardBody = document.createElement("div");

        cardBody.className =
            "card-body d-flex align-items-start gap-3";

        // Avatar del usuario

        const avatar = document.createElement("div");

        avatar.className = "avatar";

        avatar.textContent =
            item.nombre.charAt(0).toUpperCase();

        // Contenido del comentario

        const content = document.createElement("div");

        content.className = "comment-content flex-grow-1";

        const title = document.createElement("h6");

        title.className = "fw-bold mb-2";
        title.textContent = item.nombre;

        const text = document.createElement("p");

        text.className = "text-secondary mb-0";
        text.textContent = item.comentario;

        // Organizar los elementos

        content.append(title, text);
        cardBody.append(avatar, content);
        card.appendChild(cardBody);

        commentsList.appendChild(card);

    });

}

// ==========================================
// 6. OBTENER COMENTARIOS
// ==========================================

async function obtenerComentarios() {

    if (DEMO_MODE) {

        mostrarComentarios(comentarios);

        return;
    }

    const response = await fetch(API_URL);

    if (!response.ok) {

        throw new Error(
            "No se pudieron cargar los comentarios."
        );

    }

    const data = await response.json();

    mostrarComentarios(data.comentarios);

}

// ==========================================
// 7. ENVIAR COMENTARIOS
// ==========================================

form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const nuevoComentario = {

        nombre: nombre.value.trim(),
        comentario: comentario.value.trim()

    };

    // Validar campos

    if (!nuevoComentario.nombre ||
        !nuevoComentario.comentario) {

        mostrarMensaje(
            "Debes completar todos los campos.",
            "danger"
        );

        return;
    }

    // Desactivar botón durante el envío

    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando...";

    try {

        if (DEMO_MODE) {

            comentarios.unshift(nuevoComentario);

        } else {

            const response = await fetch(API_URL, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(nuevoComentario)

            });

            if (!response.ok) {

                throw new Error(
                    "No se pudo guardar el comentario."
                );

            }

        }

        // Limpiar formulario

        form.reset();

        charCount.textContent = "0 / 500 caracteres";

        mostrarMensaje(
            "Comentario publicado correctamente.",
            "success"
        );

        // Actualizar comentarios

        try {

            await obtenerComentarios();

        } catch (error) {

            mostrarMensaje(
                "Comentario guardado, pero no se pudo actualizar la lista.",
                "warning"
            );

        }

    } catch (error) {

        mostrarMensaje(error.message, "danger");

    } finally {

        submitBtn.disabled = false;
        submitBtn.textContent = "Enviar comentario";

    }

});

// ==========================================
// 8. INICIAR LA APLICACIÓN
// ==========================================

obtenerComentarios().catch(error => {

    mostrarMensaje(error.message, "danger");

});
