import logo from "../../images/logo.png";
import icon1 from "../../images/icon1.png";
import icon2 from "../../images/icon2.png";
import icon3 from "../../images/icon3.png";
import icon4 from "../../images/icon4.png";
import icon5 from "../../images/icon5.png";
import icon6 from "../../images/icon6.png";
import icon7 from "../../images/icon7.png";


export default function Navbar(){


    return(

        <div className="text-white bg-black">


            <div className="flex flex-row items-center justify-between pt-1 pb-1 pl-20 pr-20">

                <div>
                    <img src={logo} className="w-40"/>
                </div>

                <div className="flex flex-row gap-20">

                    <h3>helooo</h3>
                    <h3>helooo</h3>
                    <h3>helooo</h3>


                </div>
            
            </div>

            <hr/>







            <div className="flex flex-col items-center justify-center mt-20">


                <div className="flex flex-row gap-60">
                <img src={icon2} className="w-40 rounded-full"/>
                <img src={icon7} className="w-40"/>
                <img src={icon3} className="w-60 h-40 rounded-full"/>
                </div>



                <div>
                    <h1 className="text-5xl">The most customizable, <br/>lowest cost version of the <br/> Uniswap Protocol</h1>
                </div>


                <div className="flex flex-row gap-60 mt-10">
                <img src={icon5} className="w-40 rounded-full"/>
                <img src={icon4} className="w-40 rounded-full"/>
                </div>

                
                
            </div>
            
            
        </div>



    )
}