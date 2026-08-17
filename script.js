(function(){
  "use strict";

  /* ============ CONTACT FORM VALIDATION ============ */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  const fields = {
    name:    { el: document.getElementById('name'),    err: document.getElementById('err-name') },
    email:   { el: document.getElementById('email'),   err: document.getElementById('err-email') },
    phone:   { el: document.getElementById('phone'),   err: document.getElementById('err-phone') },
    message: { el: document.getElementById('message'), err: document.getElementById('err-message') }
  };

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^[0-9+\-()\s]{7,}$/;

  function setError(field, msg){
    field.el.classList.toggle('invalid', !!msg);
    field.err.textContent = msg || '';
  }

  function validateName(){
    const v = fields.name.el.value.trim();
    if (!v){ setError(fields.name, 'Please enter your name.'); return false; }
    if (v.length < 2){ setError(fields.name, 'Name looks too short.'); return false; }
    setError(fields.name, ''); return true;
  }

  function validateEmail(){
    const v = fields.email.el.value.trim();
    if (!v){ setError(fields.email, 'Email is required.'); return false; }
    if (!emailPattern.test(v)){ setError(fields.email, 'Enter a valid email address.'); return false; }
    setError(fields.email, ''); return true;
  }

  function validatePhone(){
    const v = fields.phone.el.value.trim();
    if (v && !phonePattern.test(v)){ setError(fields.phone, 'Enter a valid phone number.'); return false; }
    setError(fields.phone, ''); return true;
  }

  function validateTopic(){
    const checked = document.querySelector('input[name="topic"]:checked');
    const err = document.getElementById('err-topic');
    if (!checked){ err.textContent = 'Please choose a topic.'; return false; }
    err.textContent = ''; return true;
  }

  function validateMessage(){
    const v = fields.message.el.value.trim();
    if (!v){ setError(fields.message, 'Please add a short message.'); return false; }
    if (v.length < 10){ setError(fields.message, 'Message should be at least 10 characters.'); return false; }
    setError(fields.message, ''); return true;
  }

  fields.name.el.addEventListener('blur', validateName);
  fields.email.el.addEventListener('blur', validateEmail);
  fields.phone.el.addEventListener('blur', validatePhone);
  fields.message.el.addEventListener('blur', validateMessage);
  document.getElementById('topicGroup').addEventListener('change', validateTopic);

  form.addEventListener('submit', function(e){
    e.preventDefault();
    const validations = [validateName(), validateEmail(), validatePhone(), validateTopic(), validateMessage()];
    const allValid = validations.every(Boolean);

    if (!allValid){
      status.textContent = 'Please fix the highlighted fields.';
      status.classList.remove('ok');
      const firstInvalid = form.querySelector('.invalid') || document.getElementById('err-topic').textContent ? document.getElementById('topicGroup') : null;
      if (firstInvalid && firstInvalid.focus) firstInvalid.focus();
      return;
    }

    status.textContent = 'Message sent — thank you! (demo only, not actually transmitted)';
    status.classList.add('ok');
    form.reset();
    document.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
  });

  /* ============ DYNAMIC TO-DO LIST ============ */
  const todoInput = document.getElementById('todoInput');
  const addBtn = document.getElementById('addTodoBtn');
  const list = document.getElementById('todoList');
  const emptyState = document.getElementById('todoEmpty');
  const statTotal = document.getElementById('statTotal');
  const statActive = document.getElementById('statActive');
  const statDone = document.getElementById('statDone');

  let tasks = [
    { id: 1, text: 'Build contact form markup', done: true },
    { id: 2, text: 'Wire up JS validation', done: true },
    { id: 3, text: 'Style responsive grid layout', done: false }
  ];
  let nextId = 4;

  function render(){
    list.innerHTML = '';
    emptyState.style.display = tasks.length ? 'none' : 'block';

    tasks.forEach(task => {
      const li = document.createElement('li');
      li.className = task.done ? 'done' : '';
      li.dataset.id = task.id;

      const check = document.createElement('span');
      check.className = 'check';
      check.setAttribute('role','checkbox');
      check.setAttribute('aria-checked', task.done ? 'true' : 'false');
      check.setAttribute('tabindex','0');
      check.textContent = task.done ? '✓' : '';
      check.addEventListener('click', () => toggleTask(task.id));
      check.addEventListener('keydown', e => { if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); toggleTask(task.id);} });

      const span = document.createElement('span');
      span.className = 'task-text';
      span.textContent = task.text;

      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-btn';
      removeBtn.type = 'button';
      removeBtn.setAttribute('aria-label', 'Remove task: ' + task.text);
      removeBtn.textContent = '✕';
      removeBtn.addEventListener('click', () => removeTask(task.id));

      li.appendChild(check);
      li.appendChild(span);
      li.appendChild(removeBtn);
      list.appendChild(li);
    });

    statTotal.textContent = tasks.length;
    statDone.textContent = tasks.filter(t => t.done).length;
    statActive.textContent = tasks.filter(t => !t.done).length;
  }

  function addTask(){
    const text = todoInput.value.trim();
    if (!text) { todoInput.focus(); return; }
    tasks.push({ id: nextId++, text, done: false });
    todoInput.value = '';
    todoInput.focus();
    render();
  }

  function toggleTask(id){
    tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
    render();
  }

  function removeTask(id){
    tasks = tasks.filter(t => t.id !== id);
    render();
  }

  addBtn.addEventListener('click', addTask);
  todoInput.addEventListener('keydown', e => { if (e.key === 'Enter'){ e.preventDefault(); addTask(); } });

  render();
})();
