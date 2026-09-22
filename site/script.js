document.addEventListener("DOMContentLoaded", function () {
  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // Navegação suave.
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      const id = link.getAttribute("href");
      const target = document.querySelector(id);

      if (!target) return;

      event.preventDefault();

      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - 82,
        behavior: "smooth"
      });
    });
  });

  // Destaque do menu conforme a seção.
  const sections = document.querySelectorAll("main section[id]");
  const links = document.querySelectorAll("header nav a[href^='#']");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        links.forEach(function (link) {
          link.classList.toggle(
            "active-link",
            link.getAttribute("href") === "#" + entry.target.id
          );
        });
      });
    }, {
      rootMargin: "-30% 0px -60% 0px",
      threshold: 0
    });

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }


  /* =========================================================
     MENU RESPONSIVO
     ========================================================= */

  const headers = document.querySelectorAll("header");

  headers.forEach(function (header) {

    const nav = header.querySelector("nav");
    const headerInner = header.querySelector(":scope > div");

    // Se não existir menu ou conteúdo interno, não faz nada.
    if (!nav || !headerInner) return;


    /*
     * Procura primeiro um botão que já exista no HTML.
     * Caso não exista, cria o botão automaticamente.
     */
    let button = header.querySelector(
      'button[aria-label="Abrir menu"]'
    );


    /*
     * No noticias.html não existe botão no HTML.
     * Então criamos o botão usando JavaScript.
     */
    if (!button) {

      button = document.createElement("button");

      button.type = "button";

      button.className = "mobile-menu-button";

      button.setAttribute(
        "aria-label",
        "Abrir menu"
      );

      button.setAttribute(
        "aria-expanded",
        "false"
      );

      button.innerHTML = `
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M4 5h16"></path>
          <path d="M4 12h16"></path>
          <path d="M4 19h16"></path>
        </svg>
      `;

      headerInner.appendChild(button);
    }


    /*
     * Função responsável por abrir e fechar o menu.
     */
    function setMenu(open) {

      // Em telas grandes o menu volta ao estado normal.
      if (window.innerWidth > 1023) {

        nav.classList.remove("mobile-menu-open");

        button.classList.remove("is-open");

        button.setAttribute(
          "aria-expanded",
          "false"
        );

        button.setAttribute(
          "aria-label",
          "Abrir menu"
        );

        return;
      }


      // Abre ou fecha o menu.
      nav.classList.toggle(
        "mobile-menu-open",
        open
      );

      button.classList.toggle(
        "is-open",
        open
      );


      button.setAttribute(
        "aria-expanded",
        String(open)
      );


      button.setAttribute(
        "aria-label",
        open
          ? "Fechar menu"
          : "Abrir menu"
      );


      /*
       * Ícone do botão.
       * Menu fechado = três linhas.
       * Menu aberto = X.
       */
      button.innerHTML = open

        ? `
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M6 6l12 12"></path>
            <path d="M18 6L6 18"></path>
          </svg>
        `

        : `
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M4 5h16"></path>
            <path d="M4 12h16"></path>
            <path d="M4 19h16"></path>
          </svg>
        `;
    }


    /*
     * Clique no botão.
     */
    button.addEventListener("click", function () {

      const menuEstaAberto =
        nav.classList.contains(
          "mobile-menu-open"
        );

      setMenu(!menuEstaAberto);
    });


    /*
     * Quando clicar em uma opção do menu,
     * o menu fecha automaticamente.
     */
    nav.querySelectorAll("a").forEach(function (link) {

      link.addEventListener("click", function () {

        setMenu(false);

      });

    });


    /*
     * Se a tela mudar de tamanho,
     * fecha o menu para evitar problemas
     * entre celular e computador.
     */
    window.addEventListener("resize", function () {

      setMenu(false);

    });

  });

});


/*
* não achei essa função no site, visto que redireciona para o forms
* acho recomendável redirecionar para um checkout com integração.
*/
const destinatarios = {
  1: {
    chavePix: "00020126840014BR.GOV.BCB.PIX0136c53afa1c-81c6-4356-82c0-3cfec4a867230222Doação Flores de afeto5204000053039865802BR5925Jefferson Menezes dos San6009SAO PAULO62140510krSdkXBnt6630491D3",
    mensagem: "Chave pix copiada",
    botao: "Doar ao projeto Flores de Afeto"
  },
  2: {
    chavePix: "00020126360014br.gov.bcb.pix0114+55719867275795204000053039865802BR5901N6001C62160512Doacaovoflor6304DAE6",
    mensagem: "QR code copia e cola copiado",
    botao: "Doe para a instituição Vó flor (contribuição sugerida de R$30,00)",
  }
}

async function copiar(num, event) {
  const destinatario = destinatarios[num]
  if (!destinatario) return;

  try {
   await navigator.clipboard.writeText(destinatario.chavePix);
    const btn = event.currentTarget;
    btn.textContent = destinatario.mensagem;
  }
  catch(erro){
    console.error("Erro ao copiar:", erro);
    alert("Não foi possível copiar a chave pix.");
    };
}