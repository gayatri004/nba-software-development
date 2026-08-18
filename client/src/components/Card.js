import { useNavigate } from "react-router-dom";
import {
  FaArrowRight,
} from "react-icons/fa";

function Card({
  title,
  number,
  percent,
  icon,
  color = "#2563eb",
  path,
}) {
  const navigate = useNavigate();

  return (
    <div
      className="stat-card"
      onClick={() => navigate(path)}
    >
      <div className="card-top">
        <div className="card-content">
          <p className="card-title">{title}</p>

          <h2 className="card-number">{number}</h2>
        </div>

        <div className="card-icon">
  {icon}
</div>
      </div>

      <div className="card-footer">

        <div className="growth">
          <span>{percent || ""}</span>
        </div>

        <div
          className="view-details"
          onClick={(e) => {
            e.stopPropagation();
            navigate(path);
          }}
        >
          <span>View Details</span>
          <FaArrowRight />
        </div>

      </div>
    </div>
  );
}

export default Card;