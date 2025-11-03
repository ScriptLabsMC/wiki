"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Loader from "../loader/Loader";
import FormLink from '../btns/FormLink'

function imgOrDefault(url) {
  if (!url || url === "null" || url === "undefined")
    return "/svg/person.svg";
  return url;
}

export default function TeamList() {
  const [team, setTeam] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTeam = async () => {
      try {
        const response = await fetch('/data/team.json');
        if (!response.ok) throw new Error('Failed to load team data');
        const teamData = await response.json();
        setTeam(teamData);
      } catch (err) {
        console.log("[TL] Error reading 'team.json': ", err);
      } finally {
        setLoading(false);
      }
    };

    loadTeam();
  }, []);

  const showOverview = (member) => {
    setSelectedMember(member);
  };

  const closeModal = (e) => {
    e.stopPropagation();
    setSelectedMember(null);
  };

  const handleModalClick = (e) => {
    if (e.target === e.currentTarget) {
      setSelectedMember(null);
    }
  };

  if (loading) {
    return <Loader message="Cargando equipo..." />;
  }

  return (
    <>
      <div className="grid-3 team">
        {team.map((member) => (
          <div
            key={member.id}
            className="card glass person"
            onClick={() => showOverview(member)}
            style={{ cursor: "pointer" }}
          >
            {/* Badges */}
            {member.badges && member.badges.length > 0 && (
              <div className="habilities">
                {member.badges.map((badge, index) => (
                  <div
                    key={index}
                    className={`badge ${index % 3 === 1 ? 'accent1' : index % 3 === 2 ? 'accent2' : ''}`}
                  >
                    {badge}
                  </div>
                ))}
              </div>
            )}

            <div className="avatar">
              <img src={imgOrDefault(member.avatar)} alt={member.name} />
            </div>

            <div className="person-info">
              <h3 className="person-name">{member.name}</h3>
              <p className="person-role">{member.role || ""}</p>
            </div>

            <div className="person-bio">
              <p className="bio-text">
                {member.bio || "Miembro del equipo de Script Labs."}
              </p>
            </div>
          </div>
        ))}

        {/* CTA card */}
        <div
          className="card glass person"
          style={{
            textAlign: "center",
            justifyContent: "center",
            cursor: "default"
          }}
        >
          <div className="avatar join">
            <img src="/svg/logo.svg" alt="Únete al equipo" />
          </div>

          <div className="person-info" style={{ margin: "0 0 30px 0" }}>
            <h3 className="person-name">¿Quieres formar parte de nuestro equipo?</h3>
            <p className="person-role" style={{ color: "var(--muted)" }}>
              ¡Te estamos esperando!
            </p>
          </div>

          <div className="person-bio">
            <div className="person-badges">
              <FormLink/>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedMember && (
        <div className="team-modal" onClick={handleModalClick}>
          <div className="modal-content glass">
            <button className="close-btn" onClick={closeModal}>
              &times;
            </button>

            <div className="avatar">
              <img
                src={imgOrDefault(selectedMember.avatar)}
                alt={selectedMember.name}
              />
            </div>

            <div className="person-info">
              <h2 className="person-name">{selectedMember.name}</h2>
              <p className="person-role">{selectedMember.role || ""}</p>
            </div>

            <div className="person-bio">
              <p className="bio-text">
                {selectedMember.bio || "Miembro del equipo de Script Labs."}
              </p>

              {selectedMember.badges && selectedMember.badges.length > 0 && (
                <div className="person-badges">
                  {selectedMember.badges.map((badge, index) => (
                    <span
                      key={index}
                      className={`person-badge ${index % 3 === 1 ? 'accent1' : index % 3 === 2 ? 'accent2' : ''}`}
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}