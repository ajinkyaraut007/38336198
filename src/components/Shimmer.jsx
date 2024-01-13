import React from "react";

const Shimmer = ({ variant }) => {
  return (
    <div>
      {variant === "detailsSkeleton" ? (
        <div className="row">
          <div className="col-5">
            <p className="card-text placeholder-glow">
              <span className="placeholder rounded  col-9 my-1" />
              <span className="placeholder rounded bg-secondary col-4 my-1" />
              <span className="placeholder rounded bg-secondary col-9 my-1" />
              <span className="placeholder rounded bg-secondary col-6 my-1" />
            </p>
          </div>
        </div>
      ) : (
        <div className="row justify-content-center">
          <div className="d-flex flex-column">
            <p className="card-text placeholder-glow">
              {Array(5)
                .fill("")
                .map((obj, Index) => (
                  <span
                    key={Index}
                    className="placeholder rounded bg-secondary shimmerCard bg-glow col-12 my-2"
                  />
                ))}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shimmer;
