// lib/svg-system.js
export const svgColors = {
	red: "#FF0000",
	blue: "#1E90FF",
	green: "#00AA00",
	black: "#000000",
	white: "#FFFFFF",
	yellow: "#FFCC00",
	purple: "#800080",
	orange: "#FFA500",
	gray: "#808080",
	purpledc: "#7289DA",
	none: "transparent"
};

export const svgs = [
	{
		name: ["yt", "youtube"],
		content: `<svg viewBox="0 0 24 24" class="sl sl-yt sl-youtube" id="sl-youtube sl-yt">
      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
    </svg>`
	},
	{
		name: ["menu"],
		content: `<svg class="sl sl-menu" id="sl-menu" viewBox="0 0 24 24">
<path class="menu-dot dot-left" d="M9 12C9 12.5523 8.55228 13 8 13C7.44772 13 7 12.5523 7 12C7 11.4477 7.44772 11 8 11C8.55228 11 9 11.4477 9 12Z"/>
<path class="menu-dot dot-center" d="M13 12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12C11 11.4477 11.4477 11 12 11C12.5523 11 13 11.4477 13 12Z"/>
<path class="menu-dot dot-right" d="M17 12C17 12.5523 16.5523 13 16 13C15.4477 13 15 12.5523 15 12C15 11.4477 15.4477 11 16 11C16.5523 11 17 11.4477 17 12Z"/>
<path class="menu-circle" d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C21.5093 4.43821 21.8356 5.80655 21.9449 8" stroke-width="1.5" stroke-linecap="round"/>
</svg>`
	},
	{
		name: ["twitter", "tw"],
		content: `<svg viewBox="0 0 24 24" class="sl sl-twitter sl-tw" id="sl-tw sl-twitter">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>`
	},
	{
		name: ["github", "gh"],
		content: `<svg viewBox="0 0 24 24" class="sl sl-gh sl-github" id="sl-github sl-gh">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
        </svg>`
	},
	{
		name: ["sl-icon"],
		content: `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24.0 24.0" class="sl-icon" id="sl-icon" width="40px" height="40px">
    <defs>
        <linearGradient id="grd" x1="0%" y1="0%" x2="100%" y2="100%" spreadMethod="repeat">
            <stop offset="0%" stop-color="var(--shine-color-1, #7a00ff)">
                <animate attributeName="offset" values="-1;1" dur="2.5s" repeatCount="indefinite"/>
            </stop>
            <stop offset="33.333%" stop-color="var(--shine-color-2, #00a2ff)">
                <animate attributeName="offset" values="-0.666;1.333" dur="2.5s" repeatCount="indefinite"/>
            </stop>
            <stop offset="66.666%" stop-color="var(--shine-color-3, #3d00ff)">
                <animate attributeName="offset" values="-0.333;1.666" dur="2.5s" repeatCount="indefinite"/>
            </stop>
            <stop offset="100%" stop-color="var(--shine-color-1, #7a00ff)">
                <animate attributeName="offset" values="0;2" dur="2.5s" repeatCount="indefinite"/>
            </stop>
        </linearGradient>
    </defs>
    
    <g class="border">
        <path fill="none" stroke="var(--border-color, currentColor)" stroke-opacity="1.000" fill-rule="nonzero" stroke-width="1" stroke-linejoin="round" stroke-linecap="round" d="M22.50,6.38L12.00,0.38L1.50,6.37L1.50,17.63L12.00,23.63L22.50,17.63L22.50,6.38z"/>
    </g>
    
    <g class="atom" stroke="var(--atom-color, currentColor)" stroke-width="0.84" stroke-linejoin="round" stroke-linecap="round" fill="none">
        <path d="M4.97,16.31C3.99,14.72,6.35,11.50,10.24,9.12C14.12,6.74,18.06,6.10,19.03,7.69C20.01,9.28,17.65,12.50,13.76,14.88C9.88,17.26,5.94,17.90,4.97,16.31z"/>
        <path d="M19.03,16.31C18.06,17.90,14.12,17.26,10.24,14.88C6.35,12.50,3.99,9.28,4.97,7.69C5.94,6.10,9.88,6.74,13.76,9.12C17.65,11.50,20.01,14.72,19.03,16.31z"/>
        <path d="M12.00,3.75C13.86,3.75,15.38,7.44,15.38,12.00C15.38,16.56,13.86,20.25,12.00,20.25C10.14,20.25,8.63,16.56,8.63,12.00C8.63,7.44,10.14,3.75,12.00,3.75z"/>
    </g>
    
    <g class="code">
        <path fill="none" stroke="var(--code-color, currentColor)" stroke-opacity="1.000" fill-rule="nonzero" stroke-width="0.5498102" stroke-linejoin="round" stroke-linecap="round" d="M13.44,11.28Q15.72,11.95,13.41,12.94"/>
        <path fill="none" stroke="var(--code-color, currentColor)" stroke-opacity="1.000" fill-rule="nonzero" stroke-width="0.65977263" stroke-linejoin="round" stroke-linecap="round" d="M11.62,13.50L12.37,10.88"/>
        <path fill="none" stroke="var(--code-color, currentColor)" stroke-opacity="1.000" fill-rule="nonzero" stroke-width="0.5498102" stroke-linejoin="round" stroke-linecap="round" d="M10.56,11.28Q8.28,11.95,10.59,12.94"/>
    </g>
</svg>`
	},
	{
		name: ["discord", "dc"],
		content: `<svg viewBox="0 0 24 24" class="sl sl-dc sl-discord" id="sl-discord">
		<path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02C2.44 8.78 1.71 12.23 2.04 15.65c0 .02.01.04.03.05c1.57 1.15 3.1 1.84 4.59 2.3c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.18.33.25c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.5-.46 3.02-1.15 4.59-2.3c.02-.01.03-.03.03-.05c.36-3.88-.74-7.3-2.85-10.3c-.01-.01-.02-.02-.04-.02zm-10.52 8.3c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.5 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z"/>
	</svg>`
	},
	{
		name: ["heart"],
		content: `<svg viewBox="0 0 24 24" width="30" height="30">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>`
	},
	{
		name: ["star"],
		content: `<svg viewBox="0 0 24 24" width="28" height="28">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>`
	},
	{
		name: ["settings", "cog"],
		content: `<svg viewBox="0 0 24 24" width="28" height="28">
            <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
        </svg>`
	},
	{
		name: ["cf", "curseforge"],
		content: `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" id="cf" height="24" width="24" class="cf curseforge">
  <title>CurseForge</title>
  <!-- Fondo redondo -->
  <circle class="cf-circle" cx="12" cy="12" r="11" fill="#e74c3c"/>
  </g>
  <!-- Contenido escalado para ajustarse al círculo -->
  <g transform="translate(3.5, 3.5) scale(0.7)">
    <path class="forge" d="M18.326 9.2145S23.2261 8.4418 24 6.1882h-7.5066V4.4H0l2.0318 2.3576V9.173s5.1267 -0.2665 7.1098 1.2372c2.7146 2.516 -3.053 5.917 -3.053 5.917L5.0995 19.6c1.5465 -1.4726 4.494 -3.3775 9.8983 -3.2857-2.0565 0.65 -4.1245 1.6651 -5.7344 3.2857h10.9248l-1.0288 -3.2726s-7.918 -4.6688 -0.8336 -7.1127z" stroke-width="1" fill="#f39c12"></path>
  </g>
</svg>
		`
	}
	// add more icons as needed
];