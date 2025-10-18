export default function AboutManagementPage() {
  return (
    <div>
      <h1
        style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}
      >
        About Page Management
      </h1>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
        Manage your about page sections including ventures, experiences,
        hobbies, and values.
      </p>

      <div
        style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        }}
      >
        <p style={{ color: '#6b7280' }}>This page allows you to manage:</p>
        <ul
          style={{ marginTop: '1rem', color: '#6b7280', paddingLeft: '1.5rem' }}
        >
          <li>Entrepreneurial Ventures</li>
          <li>Professional Experiences</li>
          <li>Hobbies and Interests</li>
          <li>Core Values</li>
        </ul>
        <p style={{ color: '#6b7280', marginTop: '1rem' }}>
          Full implementation coming soon! For now, you can manage these
          directly in the database.
        </p>
      </div>
    </div>
  );
}


