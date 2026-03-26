let modalEl = null;

export async function getModal() {
  if (modalEl) return modalEl;

  // load Web Component from modal remote via MF
  await import('modalWC/ConfirmModal');

  // create and mount once
  modalEl = document.createElement('confirm-modal');
  document.body.appendChild(modalEl);
  return modalEl;
}

export async function openModal(config) {
  return new Promise(async (resolve) => {
    const modal = await getModal();
    modal.open(config);

    modal.addEventListener('modal-confirm',
      (e) => resolve({ confirmed: true, data: e.detail }),
      { once: true }
    );

    modal.addEventListener('modal-cancel',
      () => resolve({ confirmed: false }),
      { once: true }
    );
  });
}