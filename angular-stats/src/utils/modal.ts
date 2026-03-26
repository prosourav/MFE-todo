let modalEl: any = null;
let loaded = false;

// ✅ Load remoteEntry.js via script (correct way)
function loadRemoteScript(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // prevent duplicate loading
    const existing = document.querySelector(`script[src="${url}"]`);
    if (existing) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = url;
    script.type = 'text/javascript';
    script.async = true;

    script.onload = () => resolve();
    script.onerror = () => reject(`Failed to load ${url}`);

    document.head.appendChild(script);
  });
}

export async function openModal(config: {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: string;
  data?: any;
}): Promise<{ confirmed: boolean; data?: any }> {
  return new Promise(async (resolve) => {
    if (!loaded) {
      // ✅ Load remote script
      await loadRemoteScript('http://localhost:4000/remoteEntry.js');

      // ✅ Get container from window
      const container = (window as any).modalWC;

      if (!container) {
        throw new Error('Remote container modalWC not found on window');
      }

      // ✅ Initialize sharing
      await __webpack_init_sharing__('default');
      await container.init(__webpack_share_scopes__.default);

      // ✅ Load exposed module
      const factory = await container.get('./ConfirmModal');
      factory();

      // ✅ Create element
      modalEl = document.createElement('confirm-modal');
      document.body.appendChild(modalEl);

      loaded = true;
    }

    // ✅ Open modal with config
    modalEl.open(config);

    // ✅ Listen for confirm
    modalEl.addEventListener(
      'modal-confirm',
      (e: CustomEvent) =>
        resolve({ confirmed: true, data: e.detail }),
      { once: true }
    );

    // ✅ Listen for cancel
    modalEl.addEventListener(
      'modal-cancel',
      () => resolve({ confirmed: false }),
      { once: true }
    );
  });
}
