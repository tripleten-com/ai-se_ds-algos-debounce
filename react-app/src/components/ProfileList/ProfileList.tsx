import "./ProfileList.css";

const profiles = [
  { id: "p1", name: "Alice Johnson", email: "alice@example.com" },
  { id: "p2", name: "Bob Smith", email: "bob@example.com" },
  { id: "p3", name: "Carol White", email: "carol@example.com" },
  { id: "p4", name: "David Brown", email: "david@example.com" },
  { id: "p5", name: "Eve Davis", email: "eve@example.com" },
  { id: "p6", name: "Frank Wilson", email: "frank@example.com" },
  { id: "p7", name: "Grace Lee", email: "grace@example.com" },
  { id: "p8", name: "Henry Martinez", email: "henry@example.com" },
];

export default function ProfileList() {
  return (
    <section className="profile-list">
      <h2 className="profile-list__title">Registered Profiles</h2>
      <ul className="profile-list__list">
        {profiles.map((profile) => (
          <li key={profile.id} className="profile-list__item">
            <span className="profile-list__name">{profile.name}</span>
            <span className="profile-list__email">{profile.email}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
