import { validateReceiptFile } from '../functions/services/receipt-service';

describe('receipt-service validation', () => {
  it('accepts valid receipt files', () => {
    const file = new File(['demo'], 'comprovante.pdf', {
      type: 'application/pdf'
    });

    expect(() => validateReceiptFile(file)).not.toThrow();
  });

  it('rejects invalid extensions', () => {
    const file = new File(['demo'], 'comprovante.exe', {
      type: 'application/pdf'
    });

    expect(() => validateReceiptFile(file)).toThrow('Extensao');
  });

  it('rejects invalid mime types', () => {
    const file = new File(['demo'], 'comprovante.pdf', {
      type: 'text/plain'
    });

    expect(() => validateReceiptFile(file)).toThrow('Tipo');
  });

  it('rejects files over five megabytes', () => {
    const file = new File([new Uint8Array(5 * 1024 * 1024 + 1)], 'foto.png', {
      type: 'image/png'
    });

    expect(() => validateReceiptFile(file)).toThrow('tamanho');
  });
});
