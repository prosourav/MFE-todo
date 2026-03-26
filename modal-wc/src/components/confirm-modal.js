class ConfirmModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config = {};
  }

  connectedCallback() {
    this.render();
    this.bindEvents();
  }

  // Public API — any remote calls this to open the modal
  open(config = {}) {
    this._config = config;
    // dynamic content
    this.shadowRoot.getElementById('modal-title').textContent =
      config.title || 'Confirm';
    this.shadowRoot.getElementById('modal-message').textContent =
      config.message || 'Are you sure?';
    this.shadowRoot.getElementById('confirm-btn').textContent =
      config.confirmText || 'Confirm';
    this.shadowRoot.getElementById('cancel-btn').textContent =
      config.cancelText || 'Cancel';

    // dynamic confirm button color
    this.shadowRoot.getElementById('confirm-btn').style.background =
      config.confirmColor || '#e53935';

    // show modal
    this.shadowRoot.getElementById('overlay').style.display = 'flex';
  }

  close() {
    this.shadowRoot.getElementById('overlay').style.display = 'none';
    this._config = {};
  }

  bindEvents() {
    this.shadowRoot
      .getElementById('confirm-btn')
      .addEventListener('click', () => {
        // fire custom event with any extra data passed in config
        this.dispatchEvent(new CustomEvent('modal-confirm', {
          bubbles: true,
          composed: true, // crosses shadow DOM boundary
          detail: this._config.data || null,
        }));
        this.close();
      });

    this.shadowRoot
      .getElementById('cancel-btn')
      .addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('modal-cancel', {
          bubbles: true,
          composed: true,
        }));
        this.close();
      });

    // close on backdrop click
    this.shadowRoot
      .getElementById('overlay')
      .addEventListener('click', (e) => {
        if (e.target.id === 'overlay') {
          this.dispatchEvent(new CustomEvent('modal-cancel', {
            bubbles: true,
            composed: true,
          }));
          this.close();
        }
      });
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        #overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.45);
          z-index: 9999;
          align-items: center;
          justify-content: center;
        }
        .modal {
          background: white;
          border-radius: 12px;
          padding: 28px 24px;
          min-width: 320px;
          max-width: 420px;
          width: 90%;
          box-shadow: 0 8px 32px rgba(0,0,0,0.18);
          font-family: sans-serif;
          animation: slide-in 0.18s ease;
        }
        @keyframes slide-in {
          from { transform: translateY(-16px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        #modal-title {
          font-size: 17px;
          font-weight: 600;
          color: #222;
          margin-bottom: 8px;
        }
        #modal-message {
          font-size: 14px;
          color: #666;
          margin-bottom: 24px;
          line-height: 1.6;
        }
        .actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
        }
        #cancel-btn {
          padding: 9px 18px;
          background: #f5f5f5;
          color: #444;
          border: 1px solid #ddd;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
        }
        #cancel-btn:hover { background: #ececec; }
        #confirm-btn {
          padding: 9px 18px;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          background: #e53935;
        }
        #confirm-btn:hover { opacity: 0.88; }
      </style>

      <div id="overlay">
        <div class="modal">
          <div id="modal-title">Confirm</div>
          <div id="modal-message">Are you sure?</div>
          <div class="actions">
            <button id="cancel-btn">Cancel</button>
            <button id="confirm-btn">Confirm</button>
          </div>
        </div>
      </div>
    `;
  }
}

if (!customElements.get('confirm-modal')) {
  customElements.define('confirm-modal', ConfirmModal);
}

export default ConfirmModal;