import React from "react";

export default function DashboardHeader(props) {
  return (
    <div class={props.show ? "side-nav active z-1" : "side-nav z-0"}>
      <ul class="d-flex flex-column">
        {props.links.map((link) => (
          <li onClick={props.setSideNav}>
            <a onClick={(e) => props.changeView(e.target.innerHTML)}>{link}</a>
          </li>
        ))}
        <li class="mt-auto">
          <a href="/">Back to Home</a>
        </li>
      </ul>
      <style jsx>{`
        a {
          cursor: pointer;
          pointer-events: auto;
        }
      `}</style>
    </div>
  );
}