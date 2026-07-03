import { useNavigate } from "react-router-dom";
import {
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

function Card({
  title,
  number,
  percent,
  icon,
  color,
  path,
}) {

  const navigate = useNavigate();

  const positive = percent.startsWith("+");

  return (

    <div
      className="stat-card"
      onClick={() => navigate(path)}
    >

      <div className="card-top">

        <div>

          <p className="card-title">

            {title}

          </p>

          <h2 className="card-number">

            {number}

          </h2>

        </div>

        <div
          className="card-icon"
          style={{
            background: color,
          }}
        >

          {icon}

        </div>

      </div>

      <div className="card-footer">

        <div
          className={
            positive
              ? "growth positive"
              : "growth negative"
          }
        >

          {positive ? (

            <FaArrowUp />

          ) : (

            <FaArrowDown />

          )}

          <span>{percent}</span>

        </div>

        <small>

          This Month

        </small>

      </div>

    </div>

  );

}

export default Card;