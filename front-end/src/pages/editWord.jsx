import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function EditWord() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ word: '', partOfSpeech: '', definitions: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`https://vocab-learn-api.onrender.com/api/words/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => {
        if (!res.ok) {throw new Error('Failed to fetch word');}
        return res.json();
      })
      .then((data) => {
        setForm({
          word: data.word || '',
          partOfSpeech: data.partOfSpeech || '',
          definitions: Array.isArray(data.definitions) ? data.definitions.join('\n') : (data.definitions || ''),
        });
      })
      .catch((err) => setError(err.message));
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const token = localStorage.getItem('token');
      const body = {
        word: form.word,
        partOfSpeech: form.partOfSpeech,
        definitions: form.definitions.split('\n').map((d) => d.trim()).filter(Boolean),
      };

      const res = await fetch(`https://vocab-learn-api.onrender.com/api/words/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        navigate('/word-list');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update word');
      }
    } catch (err) {
      setError(err.message || 'Failed to update word');
    }
  };

  return (
    <div className="page">
      <h1>Edit Word</h1>
      {error && <div className="inline-error">{error}</div>}
      <form onSubmit={handleSubmit} className="container form-stack">
        <label>Word</label>
        <input name="word" value={form.word} onChange={handleChange} required />

        <label>Part of Speech</label>
        <input name="partOfSpeech" value={form.partOfSpeech} onChange={handleChange} />

        <label>Definitions (one per line)</label>
        <textarea name="definitions" value={form.definitions} onChange={handleChange} rows={6} />

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button type="button" className="btn" onClick={() => navigate('/word-list')}>Back to Word Bank</button>
          <button type="submit" className="btn">Save Changes</button>
        </div>
      </form>
    </div>
  );
}

export default EditWord;
