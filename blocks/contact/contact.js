
function createLabel(fd) {
    const label = document.createElement('label');
    label.setAttribute('for', fd.Field);
    label.textContent = fd.Label;
    if (fd.Mandatory === 'x') {
      label.classList.add('required');
    }
    return label;
  }

  function createInput(fd) {
    const input = document.createElement('input');
    input.type = fd.Type;
    input.id = fd.Field;
    input.setAttribute('placeholder', fd.Placeholder);
    if (fd.Mandatory === 'x') {
      input.setAttribute('required', 'required');
    }
    return input;
  }

  function createButton(fd) {
    const button = document.createElement('button');
    button.textContent = fd.Label;
    button.classList.add('button');
    if (fd.Type === 'submit') {
      button.addEventListener('click', async (event) => {
        const form = button.closest('form');
        if (fd.Placeholder) form.dataset.action = fd.Placeholder;
        if (form.checkValidity()) {
          event.preventDefault();
          button.setAttribute('disabled', '');
          await submitForm(form);
          const redirectTo = fd.Extra;
          window.location.href = redirectTo;
        }
      });
    }
    return button;
  }

  function createSelect(fd) {
    const select = document.createElement('select');
    select.id = fd.Field;
    if (fd.Placeholder) {
      const ph = document.createElement('option');
      ph.textContent = fd.Placeholder;
      ph.setAttribute('selected', '');
      ph.setAttribute('disabled', '');
      select.append(ph);
    }
    fd.Options.split(',').forEach((o) => {
      const option = document.createElement('option');
      option.textContent = o.trim();
      option.value = o.trim();
      select.append(option);
    });
    if (fd.Mandatory === 'x') {
      select.setAttribute('required', 'required');
    }
    return select;
  }
  


async function createForm(jsonURL){

    let pathname = new URL(jsonURL)
    
    const resp = await fetch(pathname);
    const json = await resp.json();

    const form = document.createElement('form');

    // eslint-disable-next-line prefer-destructuring
    // form.dataset.action = pathname.split('.json')[0];


    json.data.forEach((fd) => {
        fd.Type = fd.Type || 'text';
        const fieldWrapper = document.createElement('div');
        const style = fd.Style ? ` form-${fd.Style}` : '';
        const fieldId = `form-${fd.Type}-wrapper${style}`;
        fieldWrapper.className = fieldId;
        fieldWrapper.classList.add('field-wrapper');

        switch (fd.Type) {
          case 'select':
            fieldWrapper.append(createLabel(fd));
            fieldWrapper.append(createSelect(fd));
            break;
          case 'submit':
            fieldWrapper.append(createButton(fd));
            break;
          default:
            fieldWrapper.append(createLabel(fd));
            fieldWrapper.append(createInput(fd));
        }
    
        form.append(fieldWrapper);
      });
      return form;
}


export default async function decorate(block) {
    const contact = block.querySelector('a[href$=".json"]');    
    const parientDiv = document.createElement('div');
    parientDiv.classList.add('contact-block')
    
    if (contact) {
        parientDiv.append(await createForm(contact.href));
        contact.replaceWith(parientDiv);
    }
}