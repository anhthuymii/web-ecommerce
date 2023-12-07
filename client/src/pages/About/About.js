import React from "react";
import Image from "../../components/designLayouts/Image";
import ShopNow from "../../components/designLayouts/buttons/ShopNow";
import background from "../../assets/images/banner/bg.jpg";
import { Helmet } from "react-helmet";

const About = () => {
  const title = "Giới thiệu - JEANO Store";
  const description =
    "Khám phá sứ mệnh và giá trị của JEANO Store. Tìm hiểu lý do tại sao chúng tôi là điểm đến lý tưởng của bạn về thời trang và phong cách.";
  const keywords = "JEANO Store, fashion, style, online shopping";

  return (
    <div>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
      </Helmet>
      <div className="w-full h-full bg-[#f3f3f3] md:bg-transparent relative font-titleFont">
        <Image
          className="w-full h-full object-cover hidden md:inline-block"
          imgSrc={background}
        />
        <div className="w-full h-full justify-center items-center md:w-2/3 xl:w-1/2 bg-white absolute px-4 md:px-0 top-0 right-0 flex flex-col gap-6">
          <h1 className="text-3xl font-title font-bold text-primeColor">
            JEANO Store
          </h1>

          <div className="text-base font-normal text-primeColor max-w-[600px] mx-8">
            <span className="text-xl font-title px-5 bg-black text-white">
              Sứ Mệnh
            </span>
            <p>
              Chúng tôi không chỉ là một cửa hàng thời trang, mà là ngôi nhà của
              sự sáng tạo và cái đẹp. Sứ mệnh của chúng tôi là: "Mang đến cho
              bạn không gian mua sắm trực tuyến tuyệt vời nhất, nơi bạn có thể
              tự tin thể hiện phong cách và cá tính của mình."
            </p>
            <br />
            <span className="text-xl my-5 font-title px-5 bg-black text-white">
              Tại Sao Chọn JEANO Store?
            </span>
            <br />
            <ul className="list-disc ml-6">
              <li>
                <span className="underline">Thời Trang Đa Dạng:</span> JEANO
                Store tự hào cung cấp một bộ sưu tập đa dạng, từ những bộ trang
                phục hàng ngày đến những xu hướng nổi bật.
              </li>
              <li>
                <span className="underline">Chất Lượng Đỉnh Cao:</span> Chúng
                tôi chỉ cung cấp sản phẩm chất lượng hàng đầu từ những thương
                hiệu uy tín.
              </li>
              <li>
                <span className="underline">Phục Vụ Chuyên Nghiệp:</span> Đội
                ngũ hỗ trợ khách hàng của chúng tôi luôn sẵn sàng giúp đỡ bạn
                trong mọi thắc mắc và nhu cầu.
              </li>
              <li>
                <span className="underline">Mua Sắm An Toàn và Tiện Lợi:</span>{" "}
                JEANO Store cam kết bảo vệ thông tin cá nhân của bạn và mang đến
                trải nghiệm mua sắm trực tuyến thuận lợi nhất.
              </li>
            </ul>
            <p>
              Chúng tôi mong muốn được kết nối với bạn! Nếu bạn có bất kỳ câu
              hỏi hoặc góp ý nào, đừng ngần ngại liên hệ với chúng tôi.
            </p>
            <br />
            <span className="font-semibold">Liên Hệ Chúng Tôi:</span>
            <br />
            Địa Chỉ: 123 Đường Thời Trang, Thành Phố, Quốc Gia <br />
            Số Điện Thoại: 0123 456 789 <br />
            Email: info@jeanostore.com
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
