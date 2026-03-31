/* ============================================================
   Sims 4 Mod Builder — Application Logic
   View switching, form management, export handling

   Note: innerHTML usage in this file operates only on
   pre-escaped XML content (via escapeHTML). All user input is
   sanitized before insertion into the DOM.
   ============================================================ */

// --- View Management ---
function switchView(viewId) {
  document.querySelectorAll('.view').forEach(function(v) { v.classList.remove('active'); });
  document.querySelectorAll('.nav-item').forEach(function(n) { n.classList.remove('active'); });

  var view = document.getElementById('view-' + viewId);
  if (view) view.classList.add('active');

  var nav = document.querySelector('.nav-item[data-view="' + viewId + '"]');
  if (nav) nav.classList.add('active');

  if (viewId === 'trait-builder') updateTraitPreview();
  if (viewId === 'career-builder') updateCareerPreview();
  if (viewId === 'interaction-builder') updateInteractionPreview();
}

// --- Toast Notifications ---
function showToast(message) {
  var toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('visible');
  setTimeout(function() { toast.classList.remove('visible'); }, 2600);
}

// --- Escape all HTML entities for safe DOM insertion ---
function escapeHTML(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// --- XML Syntax Highlighting (operates on already-escaped content) ---
function highlightXML(xml) {
  var escaped = escapeHTML(xml);

  // Comments
  escaped = escaped.replace(/(&lt;!--.*?--&gt;)/g, '<span class="xml-comment">$1</span>');
  // Tags
  escaped = escaped.replace(/(&lt;\/?)([\w:-]+)/g, '$1<span class="xml-tag">$2</span>');
  // Attributes name="value"
  escaped = escaped.replace(/([\w:-]+)(=)(&quot;)(.*?)(&quot;)/g,
    '<span class="xml-attr">$1</span>$2<span class="xml-value">$3$4$5</span>');

  return escaped;
}

// --- Render highlighted XML into a preview element ---
// Uses innerHTML on pre-escaped content only (all user strings passed through escapeHTML first)
function renderPreview(elementId, xml) {
  var el = document.getElementById(elementId);
  if (!el) return;
  var code = document.createElement('code');
  // highlightXML escapes all raw content before adding highlight spans
  code.innerHTML = highlightXML(xml);
  el.textContent = '';
  el.appendChild(code);
}

// --- Copy Preview ---
function copyPreview(type) {
  var el = document.getElementById(type + '-preview');
  if (!el) return;
  var text = el.textContent || el.innerText;
  navigator.clipboard.writeText(text).then(function() {
    showToast('XML copied to clipboard');
  }).catch(function() {
    showToast('Failed to copy — try manually selecting the text');
  });
}

// --- Trait Builder ---
var selectedTraitIcon = 'plumbob-green';

function selectTraitIcon(btn) {
  document.querySelectorAll('#trait-icon-grid .icon-option').forEach(function(o) { o.classList.remove('selected'); });
  btn.classList.add('selected');
  selectedTraitIcon = btn.dataset.icon;
  updateTraitPreview();
}

function addBuffRow() {
  var container = document.getElementById('trait-buffs');
  var index = container.children.length;
  var row = document.createElement('div');
  row.className = 'buff-row';
  row.dataset.index = index;

  var emotionSelect = document.createElement('select');
  emotionSelect.className = 'buff-emotion';
  emotionSelect.setAttribute('onchange', 'updateTraitPreview()');
  var emotions = ['', 'Happy', 'Confident', 'Inspired', 'Focused', 'Energized', 'Flirty', 'Playful', 'Sad', 'Angry', 'Tense', 'Embarrassed', 'Bored', 'Uncomfortable', 'Dazed'];
  var labels = ['Select emotion...', 'Happy', 'Confident', 'Inspired', 'Focused', 'Energized', 'Flirty', 'Playful', 'Sad', 'Angry', 'Tense', 'Embarrassed', 'Bored', 'Uncomfortable', 'Dazed'];
  for (var i = 0; i < emotions.length; i++) {
    var opt = document.createElement('option');
    opt.value = emotions[i];
    opt.textContent = labels[i];
    emotionSelect.appendChild(opt);
  }

  var weightInput = document.createElement('input');
  weightInput.type = 'number';
  weightInput.className = 'buff-weight';
  weightInput.min = '1';
  weightInput.max = '10';
  weightInput.value = '2';
  weightInput.placeholder = 'Weight';
  weightInput.setAttribute('onchange', 'updateTraitPreview()');

  var reasonInput = document.createElement('input');
  reasonInput.type = 'text';
  reasonInput.className = 'buff-reason';
  reasonInput.placeholder = 'Buff reason';
  reasonInput.setAttribute('oninput', 'updateTraitPreview()');

  var removeBtn = document.createElement('button');
  removeBtn.className = 'btn-icon remove-buff';
  removeBtn.setAttribute('onclick', 'removeBuffRow(this)');
  removeBtn.title = 'Remove buff';
  removeBtn.textContent = '\u00D7';

  row.appendChild(emotionSelect);
  row.appendChild(weightInput);
  row.appendChild(reasonInput);
  row.appendChild(removeBtn);
  container.appendChild(row);
}

function removeBuffRow(btn) {
  var row = btn.closest('.buff-row');
  var container = document.getElementById('trait-buffs');
  if (container.children.length > 1) {
    row.remove();
    updateTraitPreview();
  } else {
    showToast('At least one buff row is required');
  }
}

function resetTraitForm() {
  document.getElementById('trait-name').value = '';
  document.getElementById('trait-desc').value = '';
  document.getElementById('trait-category').value = 'Emotional';
  document.getElementById('trait-ages').value = 'Teen, Young Adult, Adult, Elder';

  document.querySelectorAll('#trait-icon-grid .icon-option').forEach(function(o, i) {
    if (i === 0) o.classList.add('selected'); else o.classList.remove('selected');
  });
  selectedTraitIcon = 'plumbob-green';

  var buffs = document.getElementById('trait-buffs');
  while (buffs.firstChild) buffs.removeChild(buffs.firstChild);
  addBuffRow();

  document.querySelectorAll('#trait-conflicts input[type="checkbox"]').forEach(function(cb) { cb.checked = false; });
  updateTraitPreview();
  showToast('Trait form reset');
}

function getTraitConflicts() {
  var checked = [];
  document.querySelectorAll('#trait-conflicts input[type="checkbox"]:checked').forEach(function(cb) {
    checked.push(cb.value);
  });
  return checked;
}

function getTraitBuffs() {
  var buffs = [];
  document.querySelectorAll('#trait-buffs .buff-row').forEach(function(row) {
    var emotion = row.querySelector('.buff-emotion').value;
    var weight = row.querySelector('.buff-weight').value;
    var reason = row.querySelector('.buff-reason').value;
    if (emotion) {
      buffs.push({ emotion: emotion, weight: parseInt(weight) || 2, reason: reason || '' });
    }
  });
  return buffs;
}

function updateTraitPreview() {
  var name = document.getElementById('trait-name').value || 'MyTrait';
  var desc = document.getElementById('trait-desc').value || 'A custom trait.';
  var category = document.getElementById('trait-category').value;
  var ages = document.getElementById('trait-ages').value;
  var conflicts = getTraitConflicts();
  var buffs = getTraitBuffs();

  var xml = generateTraitXML({ name: name, desc: desc, category: category, ages: ages, icon: selectedTraitIcon, conflicts: conflicts, buffs: buffs });
  renderPreview('trait-preview', xml);
}

// --- Career Builder ---
var careerLevelCount = 1;

function addCareerLevel() {
  var container = document.getElementById('career-levels');
  careerLevelCount = container.children.length + 1;

  var row = document.createElement('div');
  row.className = 'career-level-row';
  row.dataset.index = careerLevelCount - 1;

  var numDiv = document.createElement('div');
  numDiv.className = 'level-number';
  numDiv.textContent = careerLevelCount;

  var fieldsDiv = document.createElement('div');
  fieldsDiv.className = 'level-fields';

  var titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.className = 'level-title';
  titleInput.placeholder = 'Level title';
  titleInput.setAttribute('oninput', 'updateCareerPreview()');

  var innerRow = document.createElement('div');
  innerRow.className = 'level-row-inner';

  // Salary field
  var salaryField = document.createElement('div');
  salaryField.className = 'field-with-label';
  var salaryLabel = document.createElement('label');
  salaryLabel.textContent = 'Salary/hr';
  var salaryInput = document.createElement('input');
  salaryInput.type = 'number';
  salaryInput.className = 'level-salary';
  salaryInput.min = '0';
  salaryInput.value = String(25 + (careerLevelCount - 1) * 15);
  salaryInput.setAttribute('oninput', 'updateCareerPreview()');
  salaryField.appendChild(salaryLabel);
  salaryField.appendChild(salaryInput);

  // Skill field
  var skillField = document.createElement('div');
  skillField.className = 'field-with-label';
  var skillLabel = document.createElement('label');
  skillLabel.textContent = 'Required Skill';
  var skillSelect = document.createElement('select');
  skillSelect.className = 'level-skill';
  skillSelect.setAttribute('onchange', 'updateCareerPreview()');
  var skills = ['', 'Logic', 'Charisma', 'Writing', 'Programming', 'Cooking', 'Fitness', 'Handiness', 'Gardening', 'Painting', 'Guitar', 'Mischief', 'Photography', 'Rocket Science', 'Research & Debate'];
  var skillNames = ['None', 'Logic', 'Charisma', 'Writing', 'Programming', 'Cooking', 'Fitness', 'Handiness', 'Gardening', 'Painting', 'Guitar', 'Mischief', 'Photography', 'Rocket Science', 'Research & Debate'];
  for (var i = 0; i < skills.length; i++) {
    var opt = document.createElement('option');
    opt.value = skills[i];
    opt.textContent = skillNames[i];
    skillSelect.appendChild(opt);
  }
  skillField.appendChild(skillLabel);
  skillField.appendChild(skillSelect);

  // Skill level field
  var skillReqField = document.createElement('div');
  skillReqField.className = 'field-with-label';
  var skillReqLabel = document.createElement('label');
  skillReqLabel.textContent = 'Skill Lvl';
  var skillReqInput = document.createElement('input');
  skillReqInput.type = 'number';
  skillReqInput.className = 'level-skill-req';
  skillReqInput.min = '0';
  skillReqInput.max = '10';
  skillReqInput.value = String(Math.min(careerLevelCount - 1, 10));
  skillReqInput.setAttribute('oninput', 'updateCareerPreview()');
  skillReqField.appendChild(skillReqLabel);
  skillReqField.appendChild(skillReqInput);

  innerRow.appendChild(salaryField);
  innerRow.appendChild(skillField);
  innerRow.appendChild(skillReqField);

  fieldsDiv.appendChild(titleInput);
  fieldsDiv.appendChild(innerRow);

  var removeBtn = document.createElement('button');
  removeBtn.className = 'btn-icon remove-level';
  removeBtn.setAttribute('onclick', 'removeCareerLevel(this)');
  removeBtn.title = 'Remove level';
  removeBtn.textContent = '\u00D7';

  row.appendChild(numDiv);
  row.appendChild(fieldsDiv);
  row.appendChild(removeBtn);
  container.appendChild(row);
  updateCareerPreview();
}

function removeCareerLevel(btn) {
  var row = btn.closest('.career-level-row');
  var container = document.getElementById('career-levels');
  if (container.children.length > 1) {
    row.remove();
    container.querySelectorAll('.career-level-row').forEach(function(r, i) {
      r.querySelector('.level-number').textContent = i + 1;
    });
    updateCareerPreview();
  } else {
    showToast('At least one career level is required');
  }
}

function getCareerLevels() {
  var levels = [];
  document.querySelectorAll('#career-levels .career-level-row').forEach(function(row, i) {
    levels.push({
      number: i + 1,
      title: row.querySelector('.level-title').value || 'Level ' + (i + 1),
      salary: parseInt(row.querySelector('.level-salary').value) || 0,
      skill: row.querySelector('.level-skill').value || '',
      skillReq: parseInt(row.querySelector('.level-skill-req').value) || 0
    });
  });
  return levels;
}

function resetCareerForm() {
  document.getElementById('career-name').value = '';
  document.getElementById('career-desc').value = '';
  document.getElementById('career-track').value = 'Standard';
  document.getElementById('career-schedule').value = 'Mon-Fri 9AM-5PM';

  var container = document.getElementById('career-levels');
  while (container.firstChild) container.removeChild(container.firstChild);
  careerLevelCount = 0;
  addCareerLevel();
  updateCareerPreview();
  showToast('Career form reset');
}

function updateCareerPreview() {
  var name = document.getElementById('career-name').value || 'MyCareer';
  var desc = document.getElementById('career-desc').value || 'A custom career.';
  var track = document.getElementById('career-track').value;
  var schedule = document.getElementById('career-schedule').value;
  var levels = getCareerLevels();

  var xml = generateCareerXML({ name: name, desc: desc, track: track, schedule: schedule, levels: levels });
  renderPreview('career-preview', xml);
}

// --- Interaction Builder ---
function addOutcomeRow() {
  var container = document.getElementById('interaction-outcomes');
  var row = document.createElement('div');
  row.className = 'outcome-row';

  var typeSelect = document.createElement('select');
  typeSelect.className = 'outcome-type';
  typeSelect.setAttribute('onchange', 'updateInteractionPreview()');
  var types = ['', 'relationship', 'skill', 'buff', 'need'];
  var typeLabels = ['Select effect...', 'Relationship Change', 'Skill Gain', 'Apply Buff', 'Need Change'];
  for (var i = 0; i < types.length; i++) {
    var opt = document.createElement('option');
    opt.value = types[i];
    opt.textContent = typeLabels[i];
    typeSelect.appendChild(opt);
  }

  var detailInput = document.createElement('input');
  detailInput.type = 'text';
  detailInput.className = 'outcome-detail';
  detailInput.placeholder = 'Detail (e.g. Friendship +5)';
  detailInput.setAttribute('oninput', 'updateInteractionPreview()');

  var removeBtn = document.createElement('button');
  removeBtn.className = 'btn-icon remove-outcome';
  removeBtn.setAttribute('onclick', 'removeOutcomeRow(this)');
  removeBtn.title = 'Remove effect';
  removeBtn.textContent = '\u00D7';

  row.appendChild(typeSelect);
  row.appendChild(detailInput);
  row.appendChild(removeBtn);
  container.appendChild(row);
}

function removeOutcomeRow(btn) {
  var row = btn.closest('.outcome-row');
  var container = document.getElementById('interaction-outcomes');
  if (container.children.length > 1) {
    row.remove();
    updateInteractionPreview();
  } else {
    showToast('At least one outcome effect is required');
  }
}

function getInteractionOutcomes() {
  var outcomes = [];
  document.querySelectorAll('#interaction-outcomes .outcome-row').forEach(function(row) {
    var type = row.querySelector('.outcome-type').value;
    var detail = row.querySelector('.outcome-detail').value;
    if (type) {
      outcomes.push({ type: type, detail: detail || '' });
    }
  });
  return outcomes;
}

function resetInteractionForm() {
  document.getElementById('interaction-name').value = '';
  document.getElementById('interaction-desc').value = '';
  document.getElementById('interaction-target').value = 'Sim';
  document.getElementById('interaction-category').value = 'Friendly';
  document.getElementById('interaction-ages').value = 'Teen, Young Adult, Adult, Elder';
  document.getElementById('interaction-autonomy').value = 'true';

  var container = document.getElementById('interaction-outcomes');
  while (container.firstChild) container.removeChild(container.firstChild);
  addOutcomeRow();
  updateInteractionPreview();
  showToast('Interaction form reset');
}

function updateInteractionPreview() {
  var name = document.getElementById('interaction-name').value || 'MyInteraction';
  var desc = document.getElementById('interaction-desc').value || '';
  var target = document.getElementById('interaction-target').value;
  var category = document.getElementById('interaction-category').value;
  var ages = document.getElementById('interaction-ages').value;
  var autonomy = document.getElementById('interaction-autonomy').value;
  var outcomes = getInteractionOutcomes();

  var xml = generateInteractionXML({ name: name, desc: desc, target: target, category: category, ages: ages, autonomy: autonomy, outcomes: outcomes });
  renderPreview('interaction-preview', xml);
}

// --- Export ---
var currentExportType = '';
var currentExportXML = '';

function exportMod(type) {
  currentExportType = type;
  var modName = '';
  var xmlContent = '';

  if (type === 'trait') {
    modName = document.getElementById('trait-name').value || 'MyTrait';
    var desc = document.getElementById('trait-desc').value || 'A custom trait.';
    var category = document.getElementById('trait-category').value;
    var ages = document.getElementById('trait-ages').value;
    var conflicts = getTraitConflicts();
    var buffs = getTraitBuffs();
    xmlContent = generateTraitXML({ name: modName, desc: desc, category: category, ages: ages, icon: selectedTraitIcon, conflicts: conflicts, buffs: buffs });
  } else if (type === 'career') {
    modName = document.getElementById('career-name').value || 'MyCareer';
    var cDesc = document.getElementById('career-desc').value || 'A custom career.';
    var track = document.getElementById('career-track').value;
    var schedule = document.getElementById('career-schedule').value;
    var levels = getCareerLevels();
    xmlContent = generateCareerXML({ name: modName, desc: cDesc, track: track, schedule: schedule, levels: levels });
  } else if (type === 'interaction') {
    modName = document.getElementById('interaction-name').value || 'MyInteraction';
    var iDesc = document.getElementById('interaction-desc').value || '';
    var target = document.getElementById('interaction-target').value;
    var iCategory = document.getElementById('interaction-category').value;
    var iAges = document.getElementById('interaction-ages').value;
    var autonomy = document.getElementById('interaction-autonomy').value;
    var outcomes = getInteractionOutcomes();
    xmlContent = generateInteractionXML({ name: modName, desc: iDesc, target: target, category: iCategory, ages: iAges, autonomy: autonomy, outcomes: outcomes });
  }

  currentExportXML = xmlContent;
  var safeName = modName.replace(/[^a-zA-Z0-9_-]/g, '_');

  var modal = document.getElementById('export-modal');
  var body = document.getElementById('export-modal-body');

  // Build modal content safely with DOM methods
  while (body.firstChild) body.removeChild(body.firstChild);

  var summary = document.createElement('div');
  summary.className = 'export-summary';

  var items = [
    ['Mod Type', type.charAt(0).toUpperCase() + type.slice(1)],
    ['Name', modName],
    ['Download File', 'StarkLabs_' + safeName + '_' + type + '.xml'],
    ['Export Format', 'XML prototype output'],
    ['Generator', 'Sims 4 Mod Builder v0.1.0']
  ];

  items.forEach(function(pair) {
    var item = document.createElement('div');
    item.className = 'export-summary-item';
    var labelSpan = document.createElement('span');
    labelSpan.className = 'export-summary-label';
    labelSpan.textContent = pair[0];
    var valueSpan = document.createElement('span');
    valueSpan.className = 'export-summary-value';
    valueSpan.textContent = pair[1];
    item.appendChild(labelSpan);
    item.appendChild(valueSpan);
    summary.appendChild(item);
  });

  var note = document.createElement('div');
  note.className = 'export-note';
  var strong = document.createElement('strong');
  strong.textContent = 'Prototype Note: ';
  note.appendChild(strong);
  note.appendChild(document.createTextNode('This prototype downloads XML only. It does not generate a Sims 4 .package yet.'));

  body.appendChild(summary);
  body.appendChild(note);
  modal.classList.add('open');
}

function closeExportModal() {
  document.getElementById('export-modal').classList.remove('open');
}

function downloadExport() {
  if (!currentExportXML) return;

  var blob = new Blob([currentExportXML], { type: 'application/xml' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  var name;
  if (currentExportType === 'trait') name = document.getElementById('trait-name').value || 'MyTrait';
  else if (currentExportType === 'career') name = document.getElementById('career-name').value || 'MyCareer';
  else if (currentExportType === 'interaction') name = document.getElementById('interaction-name').value || 'MyInteraction';
  else name = 'Mod';

  var safeName = name.replace(/[^a-zA-Z0-9_-]/g, '_');
  a.href = url;
  a.download = 'StarkLabs_' + safeName + '_' + currentExportType + '.xml';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  closeExportModal();
  showToast('Exported ' + safeName + ' XML successfully');
}

// --- Close modal on overlay click ---
document.getElementById('export-modal').addEventListener('click', function(e) {
  if (e.target === this) closeExportModal();
});

// --- Keyboard shortcuts ---
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeExportModal();
});

// --- Initialize on load ---
document.addEventListener('DOMContentLoaded', function() {
  updateTraitPreview();
  updateCareerPreview();
  updateInteractionPreview();
});
