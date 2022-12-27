export default () => `
<nav>
    <div class="center">
        <div class="icon">
            <a class="page" href="/">
                <img src="./images/home.svg", alt="home">
            </a>
            <div class="icon-caption">Home</div>
        </div>
        <div class="icon">
            <a class="page" href="/dashboard">
                <img src="./images/chart.svg", alt="dashboard">
            </a>
            <div class="icon-caption">Dashboard</div>
        </div>
        <div class="icon">
            <a class="page" href="/dump">
                <img src="./images/xray.svg", alt="dump">
            </a>
            <div class="icon-caption">Dump</div>
        </div>
    </div>
    <div class="right">
        <div class="icon">
            <div class="menu">
                <img src="./images/more.svg", alt="more">
            </div>
            <div class="icon-caption">More</div>
        </div>
    </div>
</nav>
<div class="copyright">
    &copy; Copyright 2023 Synthetic Software
</div>
`;