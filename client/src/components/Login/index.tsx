import { gapi } from "gapi-script";
import { FC, useState } from "react";
import { GoogleLogin } from "react-google-login";
import { useStoreActions, useStoreState } from "easy-peasy";
import { Navigate, useNavigate } from "react-router-dom";
import Popup from "../footer.popup";

const clientId = "752019399960-kv19erb24bcjegpnjtmclbq895bc960n.apps.googleusercontent.com";

const Login = () => {
  const setUserStatus = useStoreActions((actions: any) => actions.setUser);
  const userStatus = useStoreState((state: any) => state.store.user);
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(true);

  const onSuccess = (res: any) => {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.disconnect();
    setUserStatus({
      accessToken: res.accessToken,
      email: res.profileObj.email,
      name: res.profileObj.name,
      familyName: res.profileObj.familyName,
      givenName: res.profileObj.givenName,
    });
    navigate("/chat");
  };

  const onFailure = (res: any) => {
    console.log("Faild");
  };

  if (userStatus?.accessToken) {
    return <Navigate to="/chat" replace />;
  }

  return (
    <div id="main" className="overflow-hidden w-full flex flex-col justify-between bg-bg-main" style={{ height: "100dvh", maxHeight: "100dvh" }}>
      <header className="relative flex flex-row justify-between items-center w-full shrink-0" style={{ padding: "1.25rem 5%" }}>
        <a href="https://supernova-ge.github.io/Jipitauri/" className="text-white-100 text-sm cursor-pointer text-center" target="_blank" rel="noreferrer">
          ჩვენ <br /> შესახებ
        </a>
        <div className="absolute flex justify-center left-1/2 -translate-x-1/2">
          <h1 className="text-xl font-bold text-white-200">ჟიპიტაური</h1>
        </div>
        <span className="text-white-100 text-sm cursor-pointer text-center">&nbsp;</span>
      </header>
      <div className="flex justify-center py-4">
        <GoogleLogin clientId={clientId} buttonText="Sign in with google" onSuccess={onSuccess} onFailure={onFailure} cookiePolicy={"single_host_origin"} isSignedIn={true} />
      </div>
      <main className="overflow-y-auto overflow-x-hidden h-full z-0">
        <div
          className="bg-bg-secondary w-95 flex flex-col items-center justify-between rounded-xl pb-5 text-md text-white-100 left-2 lg:w-50 xl:w-50 2xl:w-50 mx-auto"
          style={{
            // left: "2.5%",
            display: "flex",
            maxHeight: "100%",
            overflowY: "auto",
          }}
        >
          <p className="self-start px-5 pb-20 pt-5">
            {" "}
            ალბათ, თქვენც გსმენიათ კითხვები, განხილვები თემაზე “რა საფრთხეს შეიცავს ხელოვნური ინტელექტი”. ჩვენ ამ კითხვას ყოველდღიურად ვისმენთ. “ჟიპიტაური” - ს ქართული აუდიტორიისათვის მიწოდება სწორედ ამ თემაზე თვალსაჩინო მაგალითით ცნობიერების ამაღლებას ემსახურება. ვფიქრობთ, შევძელით და ბევრი ადამიანი დავაფიქრეთ ამ საკითხზე. <br></br>
            <br></br>ცოტა ხნის წინ, კომპანია OpenAI - მ შექმნა ChatGPT, GPT3 მოდელზე დაფუძნებული სერვისი, რომელიც მთელი ინტერნეტის მონაცემების დასწავლის შედეგად შეიქმნა. Შესაბამისად, მოდელს ცოდნა აქვს იმაზე დაყრდნობით, რაც ინფორმაციის დონეზე მოიპოვება ინტერნეტ სივრცეში. ამან თავის მხრივ გამოიწვია სხვადასხვა საკითხზე სუბიექტურად თუ ობიექტურად არარელევანტური პასუხები - ხელოვნური ინტელექტი რა აზრსაც უფრო მეტ ადგილას შეხვდება, ის “აზრი” ჩამოუყალიბდება და გაავრცელებს. <br></br>
            <br></br>
            ამ მაგალითით, კარგად ჩანს რას წარმოადგენს ხელოვნური ინტელექტის საფრთხე. ეს სხვადასხვა გამოყენებაში სხვადასხვანაირად შეიძლება რეალიზდეს - დიალოგში ამ მაგალითის მსგავსად, რობოტიკაში - სხვაგვარად, ფოტო-ვიდეო მასალის შექმნა გავრცელებაში კიდევ სხვა მხრივ და ა.შ. <br></br> <br></br>
            შესაბამისად, ხელოვნური ინტელექტის უკონტროლოდ განვითარება ან არაკეთილსინდისიერი ადამიანების მიერ გამოყენება საფრთხეს წარმოადგენს და ეს არა მხოლოდ მომავალში მოხდება, არამედ უკვე რეალობაა დღეს. მისია, რომელსაც AI შემქმნელები უნდა ემსახურებოდნენ, არის ის, რომ მისგან მეტი სარგებელი და ნაკლები რისკი მოდიოდეს. <br></br>
            <br></br> ეს პროექტი, ონლაინ გაშვების მომენტიდან, სწორედ საფრთხის მიმართ მოქმედების მაგალითს ემსახურება, “ჟიპიტაური” - ს პასუხები რუსეთ-საქართველოს და რუსეთ-უკრაინის ომზე ეფუძნებოდა იმ ინფორმაციას, რომელიც მონაცემებში უფრო მეტად შეხვედრია ხელოვნურ ინტელექტს, რაც თავის მხრივ, საინფორმაციო ომის შედეგს წარმოადგენს. Მაგალითად, თუკი ხელოვნურ ინტელექტს მიმართულებას მივცემთ ე.წ. “Prompting” - ით და სწორ ინფორმაციას მივაწვდით, მაშინ ის გაითვალისწინებს ამას თავის ცოდნაში და არასწორი
            ინფორმაციის გავრცელების რისკიც შემცირდება. თუმცა, ეს უფრო შედეგთან ბრძოლას გავს, ვიდრე მის გამომწვევ მიზეზთან. <br></br>
            <br></br>Prompting-ის სწორი გამოყენება უკვე არსებული ცოდნის გარდაქმნაა - სტილისტიკური მიბაძვა, მაგალითად გალაკტიონს რომ დაეწერა ამინდის პროგნოზი” ან “გრძელი სტატიის მოკლე შინაარსის შედგენა”. <br></br>
            <br></br>ჩვენ აქ საუბარი გვაქვს იმ ცოდნის სწორ მიწოდებაზე, რომელიც დასწავლისას დაილექა მოდელის მეხსიერებაში და ჩვენ ეხლა ვცდილობთ “ფრომფთინგით” გამოვუსწოროთ ადრეულ ეტაპზე დაშვებული შეცდომები - ეს არ არის მდგრადი გზა ასეთი მოდელების გამოყენების და არც ეკონომიკურადაა გამართლებული. <br></br>
            <br></br> რადგან OpenAI კომერციული ორგანიზაციაა და კონცენტრირებულია ინგლისურ ენაზე არსებულ ცოდნაზე, ისიც იმ ცოდნაზე, რომელიც ჩვენგან დასავლეთით უფრო იყრის თავს ინტერნეტში, ჩვენს რეგიონში მოვლენებზე და მათზე გავრცელებულ ინფორმაციის სიზუსტეზე ყურადღება და ენერგია ნაკლებად აქვს მიმართული. <br></br>
            <br></br>ამიტომ, საჭიროა დროულად ავუწყოთ ფეხი დიდი ენობრივი მოდელების შექმნის ტექნოლოგიებში დასავლეთს და შევქმნათ ჩვენი მოდელები, სადაც გვექნება სრული კონტროლი იმ რესურსებზე, რომლებზეც მოხდება დასწავლა და ისტორიული ფაქტების გამოგონებასაც ავარიდებთ თავს. <br></br>
            <br></br> სწორედ ამ მიზანს ემსახურება ექსპერიმენტი “ჟიპიტაური”, გვინდა დავფიქრდეთ ყველა და რეალურ მაგალითებზე წარმოვიდგინოთ ძალიან ახლო მომავალი, სადაც მსგავს ენობრივ მოდელებზე დაფუძნებული სერვისები არამხოლოდ ამერიკული კომპანიებიდან იქნება შემოთავაზებული, არამედ ნაკლებად პასუხისმგებლიანი სახელმწიფოებიდანაც და თუ ამ მაგალითზე რაც დავინახეთ, როდესაც OpenAI-ს მოდელი საქართველოს და უკრაინის მიმართ რუსეთის აგრესიის შესახებ არასწორ პასუხებს აბრუნებს, შეგვიძლია წარმოვიდგინოთ ასეთი მძლავრი
            მოდელები მტრულად განწყობილი სახელმწიფოების ხელში.
          </p>
        </div>
      </main>
      <footer className="text-white-100 text-xs text-center px-5 py-5 lg:px-20 shrink-0 flex flex-col items-center justify-between">
        <p className="mt-5">©სუპერნოვა</p>
      </footer>
    </div>
  );
};

export default Login;
