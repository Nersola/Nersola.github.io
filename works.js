/*
  СПИСОК РАБОТ

  Чтобы добавить работу, скопируйте один блок { ... } и поменяйте поля.

  title     название работы
  category  категория (кнопки-фильтры появляются, когда работ больше 8)
  type      "video"   файл mp4 из папки works/ (например "works/reels-1.mp4")
            "youtube" ссылка или ID видео на YouTube
            "image"   картинка из папки works/
  src       путь к файлу или ссылка
  poster    обложка (картинка) для карточки
  ratio     "9/16" вертикальное (рилсы), "16/9" горизонтальное, "1/1" квадрат
            для нестандартных размеров можно писать ширину/высоту, например "1520/640"
  caption   короткое описание (можно пустое)
  compressed  true, если видео сжато (покажется пометка про оптимизацию)
*/
window.PORTFOLIO_URL = "https://t.me/prtfl_ners";

window.WORKS = [
  { title: "Рилс 1",  category: "Рилсы",  type: "video", src: "works/reels-1.mp4",  poster: "works/reels-1.jpg",  ratio: "9/16",     compressed: true },
  { title: "Рилс 2",  category: "Рилсы",  type: "video", src: "works/reels-2.mp4",  poster: "works/reels-2.jpg",  ratio: "9/16",     compressed: true },
  { title: "Рилс 3",  category: "Рилсы",  type: "video", src: "works/reels-3.mp4",  poster: "works/reels-3.jpg",  ratio: "9/16",     compressed: true },
  { title: "Баннер",  category: "Баннеры", type: "video", src: "works/banner.mp4",   poster: "works/banner.jpg",   ratio: "1520/640", compressed: true },
  { title: "Сниппет", category: "Сниппеты", type: "video", src: "works/snippet.mp4", poster: "works/snippet.jpg",  ratio: "9/16",     compressed: true },
  { title: "Горизонтальное видео", category: "Ролики", type: "video", src: "works/horizontal.mp4", poster: "works/horizontal.jpg", ratio: "16/9", compressed: true }
];
