async function loadProject() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');
    
    if (!projectId) {
        document.getElementById('project-content').innerHTML = `
            <h1>Project Not Found</h1>
            <p>No project ID specified. <a href="index.html">Return to portfolio</a>.</p>
        `;
        return;
    }
    
    try {
        const response = await fetch('data/feed.json');
        if (!response.ok) throw new Error('Failed to load project data');
        const data = await response.json();
        
        const project = data.projects && data.projects[projectId];
        
        if (!project) {
            document.getElementById('project-content').innerHTML = `
                <h1>Project Not Found</h1>
                <p>The requested project could not be found. <a href="index.html">Return to portfolio</a>.</p>
            `;
            return;
        }
        
        // Update page meta
        document.title = `${project.title} - Nidhi Joshi Portfolio`;
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.content = project.description;
        }
        
        // Update Open Graph
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.content = `${project.title} - Nidhi Joshi Portfolio`;
        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) ogDesc.content = project.description;
        
        // Render project
        const content = document.getElementById('project-content');
        content.innerHTML = `
            <h1>${escapeHtml(project.title)}</h1>
            ${project.image ? `<img src="${project.image}" alt="${escapeHtml(project.title)}" class="project-image">` : ''}
            <p class="project-description">${escapeHtml(project.description)}</p>
            
            <section>
                <h2>Technologies</h2>
                <ul class="tech-list">
                    ${project.technologies.map(tech => `<li>${escapeHtml(tech)}</li>`).join('')}
                </ul>
            </section>
            
            <section>
                <h2>Key Features</h2>
                <ul>
                    ${project.features.map(feature => `<li>${escapeHtml(feature)}</li>`).join('')}
                </ul>
            </section>
        `;
    } catch (error) {
        console.error('Error loading project:', error);
        document.getElementById('project-content').innerHTML = `
            <h1>Error Loading Project</h1>
            <p>There was an error loading the project details. <a href="index.html">Return to portfolio</a>.</p>
        `;
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', loadProject);

