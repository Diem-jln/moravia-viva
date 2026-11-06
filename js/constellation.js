(function () {
  const canvas = document.getElementById("constellationCanvas");
  const ctx = canvas.getContext("2d");
  const tooltip = document.getElementById("nodeTooltip");

  let width, height;
  let mouse = { x: -1000, y: -1000 };

  // Nodos de datos comunitarios
  const nodes = [
    { id: "moravia", label: "Moravia (Centro)", xRatio: 0.5, yRatio: 0.5, radius: 10, color: "#ffffff", url: null },
    { id: "cojardicom", label: "Cojardicom", xRatio: 0.25, yRatio: 0.35, radius: 8, color: "#00d2b4", url: "pages/cojardicom.html" },
    { id: "abracadabra", label: "Abracadabra", xRatio: 0.75, yRatio: 0.35, radius: 8, color: "#e5a93c", url: "pages/abracadabra.html" },
    { id: "jarum", label: "Jarum", xRatio: 0.5, yRatio: 0.75, radius: 8, color: "#4caf50", url: "pages/jarum.html" }
  ];

  function resize() {
    width = canvas.parentElement.clientWidth;
    height = canvas.parentElement.clientHeight;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  window.addEventListener("resize", resize);
  resize();

  // Animación del Canvas
  let pulse = 0;

  function draw() {
    ctx.clearRect(0, 0, width, height);
    pulse += 0.03;

    const centerNode = nodes[0];
    const cx = centerNode.xRatio * width;
    const cy = centerNode.yRatio * height;

    // Dibujar líneas de constelación desde el nodo central
    for (let i = 1; i < nodes.length; i++) {
      const node = nodes[i];
      const nx = node.xRatio * width;
      const ny = node.yRatio * height;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(nx, ny);
      ctx.strokeStyle = "rgba(154, 160, 166, 0.25)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Dibujar nodos
    let hoveredNode = null;

    nodes.forEach(node => {
      const nx = node.xRatio * width;
      const ny = node.yRatio * height;

      const dist = Math.hypot(mouse.x - nx, mouse.y - ny);
      const isHovered = dist < node.radius + 8;

      if (isHovered) hoveredNode = node;

      // Anillo de pulso
      ctx.beginPath();
      ctx.arc(nx, ny, node.radius + (isHovered ? 6 : Math.sin(pulse) * 3 + 2), 0, Math.PI * 2);
      ctx.fillStyle = node.color + "22";
      ctx.fill();

      // Punto central
      ctx.beginPath();
      ctx.arc(nx, ny, isHovered ? node.radius + 2 : node.radius, 0, Math.PI * 2);
      ctx.fillStyle = node.color;
      ctx.fill();

      // Etiqueta del nodo
      ctx.fillStyle = "#f0f2f5";
      ctx.font = "12px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(node.label, nx, ny + node.radius + 16);
    });

    // Control de tooltip y cursor
    if (hoveredNode) {
      canvas.style.cursor = hoveredNode.url ? "pointer" : "default";
      tooltip.style.display = "block";
      tooltip.style.left = `${hoveredNode.xRatio * width}px`;
      tooltip.style.top = `${hoveredNode.yRatio * height}px`;
      tooltip.innerHTML = hoveredNode.url ? `Ir a la sede de <strong>${hoveredNode.label}</strong> &rarr;` : `<strong>${hoveredNode.label}</strong>`;
    } else {
      canvas.style.cursor = "default";
      tooltip.style.display = "none";
    }

    requestAnimationFrame(draw);
  }

  // Interacción
  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener("mouseleave", () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  canvas.addEventListener("click", () => {
    nodes.forEach(node => {
      if (!node.url) return;
      const nx = node.xRatio * width;
      const ny = node.yRatio * height;
      const dist = Math.hypot(mouse.x - nx, mouse.y - ny);
      if (dist < node.radius + 8) {
        window.location.href = node.url;
      }
    });
  });

  draw();
})();