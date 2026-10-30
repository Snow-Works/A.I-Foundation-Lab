// src/pages/Leaderboard.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Trophy, Medal, Award, Loader2, AlertTriangle, ArrowLeft } from "lucide-react";
import { getLeaderboard } from "../services/examService.js";
import Card from "../components/ui/Card.jsx";
import PillTab from "../components/ui/PillTab.jsx";
import "./Leaderboard.css";

export default function Leaderboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [batchFilter, setBatchFilter] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const res = await getLeaderboard(batchFilter);
        if (!cancelled) setData(res);
      } catch (err) {
        console.error("[leaderboard] error:", err);
        if (!cancelled) setError("Could not load the leaderboard.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [batchFilter]);

  if (loading && !data) {
    return (
      <div className="leaderboard__loading">
        <Loader2 size={28} className="leaderboard__spinner" />
        <span>Loading leaderboard…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="leaderboard__error">
        <AlertTriangle size={20} />
        <span>{error}</span>
      </div>
    );
  }

  const { leaderboard, batches } = data || { leaderboard: [], batches: [] };
  
  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  // Helper to reorder podium: 2nd, 1st, 3rd
  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean);

  return (
    <section className="leaderboard section">
      <div className="container leaderboard__container">
        
        <Link to="/profile" className="leaderboard__back">
          <ArrowLeft size={16} /> Back to profile
        </Link>

        <Card variant="glass" size="lg" withTab glow="cyan" className="leaderboard__main-card">
          <PillTab floating position="center" variant="cyan">
            Hall of Fame
          </PillTab>

          <header className="leaderboard__header">
            <div className="leaderboard__header-text">
              <h1 className="type-h2 leaderboard__title">Top Performers</h1>
              <p className="type-body leaderboard__subtitle">
                Celebrating the students who have successfully completed the AI Foundation Lab assessment.
              </p>
            </div>
            
            <select
              className="q-form__select leaderboard__filter"
              value={batchFilter}
              onChange={(e) => setBatchFilter(e.target.value)}
            >
              <option value="">All Cohorts</option>
              {batches.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </header>

          {leaderboard.length === 0 ? (
            <div className="leaderboard__empty">
              <Trophy size={48} className="leaderboard__empty-icon" />
              <h3>No results yet</h3>
              <p>Once exams are marked and released, the top performers will appear here.</p>
            </div>
          ) : (
            <>
              {/* Podium */}
              <div className="leaderboard__podium">
                {podiumOrder.map((student, idx) => {
                  const isFirst = student.rank === 1;
                  const isSecond = student.rank === 2;
                  const isThird = student.rank === 3;
                  
                  return (
                    <div 
                      key={student.studentId} 
                      className={`leaderboard__podium-item leaderboard__podium-item--rank-${student.rank}`}
                    >
                      <div className="leaderboard__podium-avatar">
                        {isFirst ? <Trophy size={28} /> : isSecond ? <Medal size={28} /> : <Award size={28} />}
                      </div>
                      <div className="leaderboard__podium-info">
                        <span className="leaderboard__podium-name">
                          {student.first_name} {student.surname}
                        </span>
                        <span className="leaderboard__podium-batch">{student.batch}</span>
                      </div>
                      <div className="leaderboard__podium-score">
                        {student.totalScore} <span className="leaderboard__podium-max">/ {student.maxScore}</span>
                      </div>
                      <div className="leaderboard__podium-base">
                        <span className="leaderboard__podium-rank">#{student.rank}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Table for 4th place onwards */}
              {rest.length > 0 && (
                <div className="leaderboard__table-wrap">
                  <table className="leaderboard__table">
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>Student</th>
                        <th>Cohort</th>
                        <th>Score</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rest.map((student) => (
                        <tr key={student.studentId}>
                          <td><span className="leaderboard__rank-num">#{student.rank}</span></td>
                          <td>
                            <span className="leaderboard__name">
                              {student.first_name} {student.surname}
                            </span>
                          </td>
                          <td><span className="leaderboard__batch">{student.batch}</span></td>
                          <td>
                            <span className="leaderboard__score">
                              {student.totalScore}
                            </span>
                            <span className="leaderboard__max">/ {student.maxScore}</span>
                          </td>
                          <td>
                            {student.passed ? (
                              <span className="badge badge--cyan">Certified</span>
                            ) : (
                              <span className="badge badge--red">Failed</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </section>
  );
}