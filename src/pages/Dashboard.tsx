function Dashboard() {
  return (
    <div>
      <button className="ui-btn ui-btn--solid ui-btn--primary ui-btn--md">
        Primary
      </button>

      <button className="ui-btn ui-btn--outline ui-btn--neutral ui-btn--md">
        Neutral
      </button>

      <button
        className="ui-btn ui-btn--solid ui-btn--secondary ui-btn--lg"
        disabled
      >
        Disabled
      </button>
    </div>
  );
}

export default Dashboard;