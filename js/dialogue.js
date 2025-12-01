// Show dialogue popup
function showDialogueWithTyping(npcData) {
  const overlay = document.getElementById('dialogueOverlay');
  const npcIcon = document.getElementById('npcIcon');
  const npcName = document.getElementById('npcName');
  const content = document.getElementById('dialogueContent');
  const continueBtn = document.getElementById('continueDialogue');
  
  // Set NPC info
  npcIcon.textContent = npcData.icon;
  npcName.textContent = npcData.name;
  
  // Clear previous content
  content.innerHTML = '';
  
  // Show overlay
  overlay.classList.add('active');
  document.body.classList.add('dialogue-open');
  
  // Disable continue button during typing
  continueBtn.disabled = true;
  continueBtn.style.opacity = '0.5';
  
  // Type out each paragraph
  let paragraphIndex = 0;
  
  function typeNextParagraph() {
    if (paragraphIndex >= npcData.dialogue.length) {
      // All done typing
      continueBtn.disabled = false;
      continueBtn.style.opacity = '1';
      return;
    }
    
    const p = document.createElement('p');
    const text = npcData.dialogue[paragraphIndex];
    let charIndex = 0;
    
    content.appendChild(p);
    
    const typingInterval = setInterval(() => {
      if (charIndex < text.length) {
        p.textContent += text[charIndex];
        charIndex++;
      } else {
        clearInterval(typingInterval);
        paragraphIndex++;
        setTimeout(typeNextParagraph, 300); // Pause between paragraphs
      }
    }, 20); // 30ms per character
  }
  
  typeNextParagraph();
}

// Close dialogue popup
function closeDialogue() {
  const overlay = document.getElementById('dialogueOverlay');
  overlay.classList.remove('active');
  document.body.classList.remove('dialogue-open');
}

// Initialize dialogue event listeners
function initDialogueListeners() {
  const closeBtn = document.getElementById('closeDialogue');
  const continueBtn = document.getElementById('continueDialogue');
  const overlay = document.getElementById('dialogueOverlay');
  
  // Close button
  closeBtn.addEventListener('click', closeDialogue);
  
  // Continue button
  continueBtn.addEventListener('click', closeDialogue);
  
  // Click outside to close
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeDialogue();
    }
  });
  
  // Escape key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeDialogue();
    }
  });
}