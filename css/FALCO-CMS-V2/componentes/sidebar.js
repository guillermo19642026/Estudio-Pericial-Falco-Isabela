export function cargarSidebar(paginaActiva = "") {

    return `

<aside class="cms-v2-sidebar">

    <div class="cms-v2-brand">
        <div class="cms-v2-brand-mark">F</div>

        <div class="cms-v2-brand-text">
            <strong>FALCO CMS®</strong>
            <span>Workspace profesional</span>
        </div>
    </div>

    <div class="cms-v2-sidebar-scroll">

        <div class="cms-v2-nav-label">Dashboard</div>

        <nav class="cms-v2-nav">

            <a href="dashboard.html"
               class="${paginaActiva==="dashboard"?"is-active":""}">
                <i data-lucide="layout-dashboard"></i>
                Centro de Control
            </a>

        </nav>

        <div class="cms-v2-nav-label">Contenido</div>

        <nav class="cms-v2-nav">

            <a href="contenidos.html"
               class="${paginaActiva==="contenidos"?"is-active":""}">
                <i data-lucide="files"></i>
                Contenidos
            </a>

            <a href="editor.html"
               class="${paginaActiva==="editor"?"is-active":""}">
                <i data-lucide="plus-circle"></i>
                Nuevo contenido
            </a>

            <a href="papelera.html"
               class="${paginaActiva==="papelera"?"is-active":""}">
                <i data-lucide="trash-2"></i>
                Papelera
            </a>

        </nav>

        <div class="cms-v2-nav-label">Ecosistema</div>

        <nav class="cms-v2-nav">

            <a href="#">
                <i data-lucide="library"></i>
                Biblioteca
            </a>

            <a href="#">
                <i data-lucide="graduation-cap"></i>
                Formación
            </a>

            <a href="#">
                <i data-lucide="clipboard-check"></i>
                Evaluaciones
            </a>

        </nav>

        <div class="cms-v2-nav-label">Sistema</div>

        <nav class="cms-v2-nav">

            <a href="#">
                <i data-lucide="users"></i>
                Usuarios
            </a>

            <a href="#">
                <i data-lucide="settings"></i>
                Configuración
            </a>

        </nav>

    </div>

    <div class="cms-v2-sidebar-footer">

        <div class="cms-v2-user-avatar">
            IF
        </div>

        <div class="cms-v2-user-info">
            <strong>Invitado</strong>
            <span>Acceso no autenticado</span>
        </div>

    </div>

</aside>

`;

}