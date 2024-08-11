import { useEffect } from "react"
import "../styles/onescore.css"

export default function(props){

    useEffect(()=>{
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 10);
    }, [])

    const blurbs = {
        "2k": `The 2k score is a key metric in your running performance, serving as a comprehensive reflection of 
        your endurance and speed. This score represents the average time it takes you to run a single kilometer, 
        calculated meticulously down to the second. To ensure accuracy, we analyze up to your 30 most recent runs, 
        taking into account every single kilometer you have covered during that time. Nothing is overlooked, and no 
        distance is too small. This is the minimum distance we measure being the start of your TMRUN journey. 
        By focusing on each individual kilometer, the 2k score gives 
        you a clear, in depth understanding of your running progress, helping you to track improvements, set goals, 
        and push your limits with every run.`,
        "5k": `The 5k score offers a deeper dive into your running performance, focusing on a distance that balances 
        speed and endurance. This score reflects your average pace per kilometer over a 5 kilometer run, calculated 
        with precision. By analyzing your performance across multiple 5k runs, we provide insights into your ability 
        to sustain a challenging pace over a moderate distance. This score helps you gauge your middle distance 
        capabilities, allowing you to fine tune your pacing strategies and work towards longer distances.`,
        "10k": `The 10k score is a critical indicator of your long distance running proficiency. This score is derived 
        from the average time it takes you to complete a kilometer over a 10 kilometer run, capturing both your endurance 
        and your speed over a significant distance. By evaluating your performance across several 10k runs, we offer 
        a detailed view of your ability to maintain a steady pace and manage your energy over a more demanding distance. 
        This score is instrumental in helping you strategize for races and achieve personal milestones.`,
        "20k": `The 20k score provides an extensive assessment of your long distance running capabilities. This score 
        reflects your average kilometer time over a grueling 20 kilometer run, highlighting your endurance and stamina 
        at an advanced level. By analyzing multiple 20k runs, we deliver insights into your ability to sustain a high 
        level of performance over a very long distance. This score is essential for those looking to push their limits, 
        train for marathons, and set ambitious long distance goals. It’s the ultimate benchmark for gauging your peak 
        endurance and running prowess.`,
        "High Riser": `The High Riser score is a unique measure of your climbing prowess, focusing on the total 
        elevation gain achieved during your recent runs with a minimum distacne of 2 kilometers. Unlike 
        time based metrics, this score evaluates the vertical challenge you’ve tackled, emphasizing the terrain 
        and routes you’ve conquered rather than the speed at which you completed them. By analyzing up to 30 of 
        your most recent runs, we capture the full scope of your elevation achievements, providing insights into 
        your ability to handle varied and demanding terrain. This score is perfect for assessing your endurance 
        and strength on hilly or mountainous routes, highlighting how effectively you navigate and overcome 
        elevation challenges in your running journey.`,
        "Captain Consistent": `The Captain Consistent score measures how often you’ve hit the pavement in the 
        last month, focusing on your commitment to running rather than the distance covered. With a minimum 
        distance of 2 kilometers per session, it doesn’t matter if you walked those 2 kilometers or ran 20. 
        What counts is your consistency. This score is all about how frequently you’re getting out there and 
        staying active. The highest scores, reaching 85 or more, are reserved for those who run daily, 
        demonstrating unwavering dedication and regular effort. Emphasizing frequency over distance, the Captain 
        Consistent score highlights your persistent commitment to your running routine and keeps you motivated 
        to maintain that steady pace.`,
        "Pacer": `The Pacer score evaluates the consistency of your running pace by analyzing all your runs 
        with a minimum distance of 2 kilometers. It calculates the average difference between your fastest 
        and slowest individual kilometers within each run. The actual speeds of these kilometers are not the 
        focus; rather, the score highlights how steady and even your overall pace is across your runs. 
        A lower Pacer score indicates a more consistent pace, showing that you maintain a steady rhythm 
        throughout your run. This metric helps you understand and improve your pacing stability, ensuring 
        that you can keep a reliable speed no matter the distance you cover.`,
        "Momentum": `The Momentum score measures your running efficiency by considering your average speed 
        across all runs of at least 2 kilometers, adjusted for your weight. This score accounts for the fact 
        that carrying more mass makes it harder to achieve higher speeds, so it rewards both fast runners and 
        those who maintain a steady pace while managing a larger body. Essentially, the Momentum score 
        reflects how well you’re performing relative to your weight, highlighting your ability to move 
        efficiently and maintain a strong pace regardless of your size. It becomes larger as you either 
        run faster or move steadily with greater body mass, acknowledging the effort and performance 
        required in both scenarios.`,
        "Night Owl": `The Night Owl score is awarded to runners who prefer to hit the pavement after the sun sets. 
        If most of your runs occur in the evening, this characteristic highlights your dedication to training 
        during the quieter, cooler hours of the day. Running in the evening offers a unique set of benefits: 
        cooler temperatures can make for a more comfortable workout, and the day's stresses are often released 
        with each stride, providing a chance for reflection and relaxation. The evening run can also help you 
        unwind and transition from the hustle and bustle of daily life to a more serene state. Additionally, 
        evening runs can improve your sleep quality by regulating your circadian rhythm, and they often 
        allow for a more leisurely pace without the rush of the day’s obligations. If you find yourself 
        thriving in the twilight hours, the Night Owl score celebrates your commitment to making the 
        most of your evening runs and embracing the distinctive advantages of training after dark.`,
        "Early Bird": `The Early Bird score is awarded to those who rise with the sun and lace up their running 
        shoes at the crack of dawn. If most of your runs take place in the morning, this characteristic 
        reflects your commitment to starting the day on an active note. Running in the early hours offers 
        several advantages: it kickstarts your metabolism, sets a positive tone for the rest of the day, 
        and often provides a sense of accomplishment before the day's demands begin. Morning runs can be 
        invigorating, as the fresh, crisp air and quieter surroundings offer a peaceful and energizing 
        environment. Additionally, exercising in the morning helps regulate your circadian rhythm and 
        can lead to improved focus and productivity throughout the day. The Early Bird score celebrates 
        your dedication to harnessing the benefits of early morning exercise, showing your ability 
        to prioritize your fitness routine and embrace the unique rewards of starting your day with a run.`,
        "Equal Time Runner": `The Equal Time Runner score is for those who balance their running routine 
        equally between morning and evening sessions. If your runs are split between AM and PM, this 
        characteristic highlights your versatility and commitment to maintaining a well rounded 
        training schedule. Running at both times of day offers the best of both worlds: the invigorating 
        start of a morning run and the calming release of an evening session. By incorporating both morning 
        and evening runs, you’re not only enhancing your overall fitness but also adapting to various 
        conditions and maximizing the benefits of different times of day. This approach can lead to 
        improved consistency, flexibility, and overall performance. The Equal Time Runner score 
        celebrates your ability to manage and thrive in diverse running schedules, reflecting a balanced 
        and adaptable approach to your fitness journey.`,
        "Late Finisher": `The Late Finisher score is awarded to runners who find their top gear 
        towards the end of their run. If you frequently achieve your fastest kilometer in the latter 
        part of your workout, this characteristic highlights your ability to finish strong. This score 
        indicates that you possess the endurance and mental fortitude to push through fatigue and accelerate 
        as your run progresses. Running your fastest kilometer towards the end demonstrates effective pacing 
        strategy, stamina, and a strong finishing drive. It reflects your capacity to conserve energy, maintain 
        focus, and unleash a powerful burst when it matters most. The Late Finisher score celebrates your 
        resilience and strategic approach, showcasing your ability to maximize performance and finish your 
        runs with intensity and vigor.`,
        "Early Pusher": `The Early Pusher score is given to runners who achieve their fastest kilometer at 
        the beginning of their runs. If you consistently hit your top speed early on, this characteristic 
        highlights your ability to start strong and push hard from the get go. This score reflects your 
        capacity to set a brisk pace right from the start, showcasing both speed and determination. Running 
        your fastest kilometer early in your workout indicates a powerful burst of energy and a proactive 
        approach to your training. It demonstrates your skill in leveraging a strong start to maximize 
        performance before fatigue sets in. The Early Pusher score celebrates your dynamic approach to running, 
        emphasizing your ability to make a strong impression right out of the gate and maintain high energy 
        levels at the onset of your runs.`,
        "Day To Day Pusher": `The Day To Day Pusher score is awarded to runners who consistently push their 
        limits by achieving a notable speed across different days. This score evaluates the variability and 
        intensity of your fastest kilometer from run to run, showing how your peak performance fluctuates 
        over time. Rather than focusing on a single fast kilometer, this score captures your ability 
        to push hard on various days, reflecting the range of your top speeds. It highlights your 
        versatility and persistence, as well as your capacity to maintain high performance across different 
        conditions and sessions. Whether you’re consistently hitting impressive speeds or experiencing 
        varied paces, the Day To Day Pusher score celebrates your ongoing effort to challenge yourself 
        and elevate your running game each day.`,
        "Improver": `The Improver score is a percentage that tracks your progress over time by comparing the 
        pace of your most recent run to the pace of the oldest run of the same distance from your recent 
        activities. This score highlights how much you’ve improved your performance in terms of pace, encouraging 
        you to consistently push for better results. To calculate this score, we take your latest run and 
        compare it with the earliest run of the same distance among your recent workouts. The percentage 
        reflects the improvement in your pace, showcasing your ongoing development and commitment to enhancing 
        your running efficiency. By focusing on your oldest run in the recent batch, the Improver score motivates 
        you to maintain a steady path of progress and celebrate the strides you’re making over time. It’s a 
        testament to your dedication and growth, rewarding your efforts to become a faster and more 
        efficient runner.`,
        "Meal Runner": `The Meal Runner score represents the percentage of your most recent runs that burn 
        enough calories to equate to a small meal, specifically 300 calories. This metric helps debunk common 
        misconceptions about running and weight loss, highlighting that the calorie expenditure from running might 
        be lower than many people assume. At TMRUN, our goal is to foster a healthy relationship with 
        running that goes beyond weight management. While running does contribute to calorie burning, 
        it’s important to understand it as part of a balanced lifestyle rather than just a tool for weight loss. 
        The Meal Runner score provides insight into how your running sessions translate into calorie expenditure, 
        promoting a more informed and holistic view of your fitness journey. It encourages you to appreciate 
        running for its myriad benefits—physical, mental, and emotional—rather than focusing solely on its 
        impact on weight.`        
}
    

    return (
        <div className="oneScoreCon">
            <div className="leftOneScore">
                <h1>{props.name}</h1>
                <h2>{props.value}</h2>
            </div>
            <p>
                {blurbs[props.name]}
            </p>
        </div>
    )
}