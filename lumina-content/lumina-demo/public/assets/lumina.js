document.addEventListener('click', async (event) => {
    const btn = event.target.closest('[data-lumina-tag][data-lumina-delta]');
    if (!btn) return;

    const tag = btn.getAttribute('data-lumina-tag');
    const delta = parseFloat(btn.getAttribute('data-lumina-delta') || '0');

    if (!tag || isNaN(delta)) return;

    try {
        const res = await fetch('/api/preferences/adjust-tag', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tag, delta }),
        });

        if (!res.ok) {
            console.error('Failed to update preferences', await res.text());
            return;
        }

        const data = await res.json();
        console.log('Updated weights:', data.weights);

        btn.classList.add('lumina-button-ack');
        setTimeout(() => btn.classList.remove('lumina-button-ack'), 400);
    } catch (err) {
        console.error('Error updating preferences', err);
    }
});
