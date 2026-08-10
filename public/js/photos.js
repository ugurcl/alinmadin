const PHOTOS = {
  "alan-kay": { name: "Alan Kay", artist: "Marcin Wichary", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0/", source: "https://commons.wikimedia.org/wiki/File:Alan_Kay_and_the_prototype_of_the_Dynabook_%283009206205%29.jpg" },
  "anders-hejlsberg": { name: "Anders Hejlsberg", artist: "DBegley", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0/", source: "https://commons.wikimedia.org/wiki/File:Anders_Hejlsberg.jpg" },
  "bjarne-stroustrup": { name: "Bjarne Stroustrup", artist: "ICPCNews", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0/", source: "https://commons.wikimedia.org/wiki/File:Bjarne_Stroustrup_%282013%29.jpg" },
  "brendan-eich": { name: "Brendan Eich", artist: "Darcy Padilla", license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/", source: "https://commons.wikimedia.org/wiki/File:Brendan_Eich_Mozilla_Foundation_official_photo.jpg" },
  "chris-lattner": { name: "Chris Lattner", artist: "Waldyrious", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/", source: "https://commons.wikimedia.org/wiki/File:Chris_Lattner_at_FOSDEM_2011_%28colorized%29.jpg" },
  "guido-van-rossum": { name: "Guido van Rossum", artist: "Kushal Das", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/", source: "https://commons.wikimedia.org/wiki/File:Guido_van_Rossum_in_PyConUS24_%28cropped%29.jpg" },
  "james-gosling": { name: "James Gosling", artist: "Peter Campbell", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/", source: "https://commons.wikimedia.org/wiki/File:James_Gosling_2008.jpg" },
  "larry-wall": { name: "Larry Wall", artist: "Randal Schwartz", license: "CC BY-SA 2.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/", source: "https://commons.wikimedia.org/wiki/File:Larry_Wall_YAPC_2007.jpg" },
  "linus-torvalds": { name: "Linus Torvalds", artist: "Krd (fotoğraf), Von Sprat (kırpma)", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/", source: "https://commons.wikimedia.org/wiki/File:LinuxCon_Europe_Linus_Torvalds_03_%28cropped%29.jpg" },
  "martin-odersky": { name: "Martin Odersky", artist: "LindaPoengPhotography", license: "CC BY 3.0", licenseUrl: "https://creativecommons.org/licenses/by/3.0/", source: "https://commons.wikimedia.org/wiki/File:Mark_Odersky_photo_by_Linda_Poeng.jpg" },
  "rasmus-lerdorf": { name: "Rasmus Lerdorf", artist: "William Stadtwald Demchick", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/", source: "https://commons.wikimedia.org/wiki/File:Rasmus_Lerdorf_August_2014_%28cropped%29.JPG" },
  "rich-hickey": { name: "Rich Hickey", artist: "Tapestry Dude", license: "CC BY-SA 2.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/", source: "https://commons.wikimedia.org/wiki/File:Rich_Hickey.jpg" },
  "rob-pike": { name: "Rob Pike", artist: "Kevin Shockey", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0/", source: "https://commons.wikimedia.org/wiki/File:Rob-pike-oscon.jpg" },
  "roberto-ierusalimschy": { ext: "png", name: "Roberto Ierusalimschy", artist: "Lua in Moscow Conference", license: "CC BY 3.0", licenseUrl: "https://creativecommons.org/licenses/by/3.0/", source: "https://commons.wikimedia.org/wiki/File:Roberto_Ierusalimschy.png" },
  "ryan-dahl": { name: "Ryan Dahl", artist: "David Calhoun", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0/", source: "https://commons.wikimedia.org/wiki/File:Ryan_Dahl.jpg" },
  "yukihiro-matsumoto": { name: "Yukihiro Matsumoto", artist: "Christopher Adams", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0/", source: "https://commons.wikimedia.org/wiki/File:Yukihiro_Matsumoto_%282018%29.jpg" },
};

const PARODY_TAG =
  '<span class="parody-tag" title="Bu içerik kurgudur. Adı geçen kişiyle ilgisi yoktur.">parodi</span>';

function photoSrc(slug) {
  const p = PHOTOS[slug];
  return p ? `/img/${slug}.${p.ext || "jpg"}` : "";
}

function personAvatar(slug, fallbackText, className, gradient) {
  if (PHOTOS[slug]) {
    return `<img class="${className} avatar-photo" src="${photoSrc(slug)}" alt="${PHOTOS[slug].name}" loading="lazy" width="120" height="120">`;
  }
  return `<div class="${className}" style="background:${gradient}">${fallbackText}</div>`;
}

function renderPhotoCredits() {
  const box = document.getElementById("photo-credits");
  if (!box) return;
  box.innerHTML = Object.keys(PHOTOS)
    .sort((a, b) => PHOTOS[a].name.localeCompare(PHOTOS[b].name, "tr"))
    .map((slug) => {
      const p = PHOTOS[slug];
      return `<li><a href="${p.source}" target="_blank" rel="noopener">${p.name}</a> — ${p.artist}, <a href="${p.licenseUrl}" target="_blank" rel="noopener">${p.license}</a></li>`;
    })
    .join("");
}
