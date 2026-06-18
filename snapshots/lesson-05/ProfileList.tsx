import { useState, useRef } from "react";
import {
  debounceLeading,
  debounceTrailing,
} from "../../utils/debounce-complete";

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
  const [query, setQuery] = useState("");
  const [displayedProfiles, setDisplayedProfiles] = useState(profiles);

  const filterRef = useRef(
    debounceTrailing((query: string) => {
      const filtered = profiles.filter((profile) => {
        return profile.name.toLowerCase().includes(query.toLowerCase());
      });
      setDisplayedProfiles(filtered);
    }, 300),
  );

  const refreshRef = useRef(
    debounceLeading(() => {
      setQuery("");
      setDisplayedProfiles(profiles);
    }, 500),
  );

  return (
    <section className="profile-list">
      <h2 className="profile-list__title">Registered Profiles</h2>
      <label htmlFor="search">
        <input
          id="search"
          type="search"
          className="profile-list__search"
          onChange={(e) => {
            setQuery(e.target.value);
            filterRef.current(e.target.value);
          }}
          value={query}
        />
      </label>
      <button
        type="button"
        className="profile-list__refresh-btn"
        onClick={() => {
          refreshRef.current();
        }}
      >
        Refresh
      </button>
      <ul className="profile-list__list">
        {displayedProfiles.map((profile) => (
          <li key={profile.id} className="profile-list__item">
            <span className="profile-list__name">{profile.name}</span>
            <span className="profile-list__email">{profile.email}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
