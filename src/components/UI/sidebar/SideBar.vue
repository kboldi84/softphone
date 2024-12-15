<template>
<ul class="nav-links">
          <li class="nav-links-item">
            <router-link to="/" class="nav-links-item-element">
            <a   href="#">
              <i class="fa-solid fa-house"></i>
              <span class="link_name">Irányítópult</span>
            </a>
            <ul class="sub-menu blank">
              <li><a  class="link_name" href="#">Irányítópult</a></li>
            </ul>
          </router-link>
          </li>
          <li class="nav-links-item">
            <router-link to="/Calls" class="nav-links-item-element">
                <a  href="#">
                <i class="fa-solid fa-mobile-screen-button"></i>
                <span class="link_name">Tárcsázás</span>
            </a>
            <ul class="sub-menu blank">
              <li><a class="link_name" href="#">Tárcsázás</a></li>
            </ul>
            </router-link>
          
          </li>
          <li class="nav-links-item">
            <router-link to="/Cimtar" class="nav-links-item-element">
            <a   href="#">
              <i class="fa-solid fa-address-book" ></i>
              <span class="link_name">Névjegyzék</span>
            </a>
            <ul class="sub-menu blank">
              <li><a  class="link_name" href="#">Névjegyzék</a></li>
            </ul>
          </router-link>
          </li>
          <li class="nav-links-item">
            <router-link to="/Fav" class="nav-links-item-element">
            <a class="nav-links-item-element" href="#">
              <i class="fa-solid fa-star" ></i>
              <span class="link_name">Kedvencek</span>
            </a>
            <ul class="sub-menu blank">
              <li><a class="link_name" href="#">Kedvencek</a></li>
            </ul>
          </router-link>
          </li>
          <li class="nav-links-item">
             <router-link to="/Logs" class="nav-links-item-element">
            <a class="nav-links-item-element" href="#">
              <i class="fa-solid fa-phone"  ></i>
              <span class="link_name">Híváslista</span>
            </a>
            <ul class="sub-menu blank">
              <li><a class="link_name" href="#">Híváslista</a></li>
            </ul>
            </router-link>
          </li>
          <li class="nav-links-item">
            <a class="nav-links-item-element" href="#">
              <i class="fa-solid fa-phone-slash"  ></i> 
              <span class="link_name">Nem fogadottt hívás</span>
            </a>
            <ul class="sub-menu blank">
              <li><a class="link_name" href="#">Elmulasztott hívás</a></li>
            </ul>
          </li>
          <li class="nav-links-item">
            <a class="nav-links-item-element" href="#">
              <i  class="fa-solid fa-comments"  ></i>
              <span class="link_name">Üzenetek</span>
            </a>
            <ul class="sub-menu blank">
              <li><a class="link_name" href="#">Üzenetek</a></li>
            </ul>
          </li>
          <li class="nav-links-item">
            <a class="nav-links-item-element" href="#">
              <i class="fa-solid fa-gear"  ></i>
              <span class="link_name">Beállítások</span>
            </a>
            <ul class="sub-menu blank">
              <li><a class="link_name" href="#">Beállítások</a></li>
            </ul>
          </li>

          <li >
            <div class="profile-details">
              <div class="profile-content">
                <!--<img src="image/profile.jpg" alt="profileImg">-->
              </div>
              <div class="name-job">
                <div class="profile_name">Boldizsár Krisztián</div>
                <div class="job">Developer</div>
              </div>
              <span class="logout-icon"><i class="fa-solid fa-right-from-bracket"></i></span>
            </div>
          </li>
        </ul>
</template>
