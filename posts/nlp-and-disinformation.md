---
title: "Can You Identify Which Of These Tweets Are Written By An AI Model? – Most People Can’t"
slug: "nlp-and-disinformation"
date: "Sep 2, 2020"
read: "11 min read"
excerpt: "How easy is it to fool people with AI? As I found out, very easy."
---
> Mark my words — A.I. is far more dangerous than nukes
> *Elon Musk*

A.I. is a double-edged sword. On one end, society can train models that can detect cancer earlier than most clinicians creating healthier humans. Yet A.I. can also be used to alter video to make politicians say things they never did with Deepfake (check out Jordan Peele doing that [here](https://www.theverge.com/tldr/2018/4/17/17247334/ai-fake-news-video-barack-obama-jordan-peele-buzzfeed)).

I’ve been speaking with many of my friends (most of whom are tech nerds like me) and they believe that most Americans can see through these “obvious” fakes. If you scrutinize that Jordan Peele video above, you might begin to see the areas that the model is not able to map features on the face correctly. You’ll soon find yourself in the [uncanny valley](https://spectrum.ieee.org/automaton/robotics/humanoids/what-is-the-uncanny-valley), unable to see Obama on screen but rather a humanoid. I agree that, if given enough time, some people would be able to discern between something that’s fake or not but most people will acquiesce to what’s shown to them simply because they don’t have the time or desire to validate what they are seeing on the screen is factual.

I wanted to test this hypothesis by running a quick example using an AI model that I trained in a few days using Trump’s Tweets. In this experiment, I gathered all of Trump’s tweets from the last year, trained an RNN model, and had the model return a series of brand new tweets. I then sent out a survey to a group of Americans in different age groups where they would have to pick out which tweet is fake in a group of real tweets. The results of the survey are below.

## Building the Model

**I’m going to go through here how I built the model. If you aren’t interested in this part, please skip to the survey results section.**

To begin, I used Google Colab and Tensorflow 2 to build an RNN model to do this text generator. As I mentioned above this whole process took me 3 days to gather data, build, and launch the survey.

The first part was the data gathering. Being lazy, I wanted to see if someone had already scrapped Twitter to build this dataset. I was ecstatic when I found this [Github](https://github.com/harshilkamdar/trump-tweets/blob/master/trump.txt) that had all of Trump’s tweets going back till around 2015.

From there I set out to build the RNN to create the actual model. I don’t want to inundate this post with code so instead, I’ll link a great resource from Google [here](https://www.tensorflow.org/tutorials/text/text_generation). The process of creating two maps for encoding and decoding is the same as what I did. My only difference (and something they mention in the article) was to use an LSTM layer instead of a GRU layer. This was mostly because I’ve only worked with LSTMs in the past but the difference between the two here is mostly negligible. This [Quora post](https://www.quora.com/Whats-the-difference-between-LSTM-and-GRU#:~:text=as%20input%20gates.-,GRU%20use%20less%20training%20parameters%20and%20therefore%20use%20less%20memory,faster%20operation%20go%20for%20GRU.) does a really good job describing the differences.

So from here I ran our model and man was it a waste of time and resources. This first iteration was not able to create anything of value and instead was flooded by symbols like /,”,$,&, and many others.

Going back to the drawing board this made sense. How an RNN works is that it accepts the output of a previous cell and uses that to predict the current value. How we train our model is by giving it a sequence of N characters and having it try to predict the N+1 character. In our application this is shown in the following example:

```
Input -> "I was saddened to learn of the passing of India's former President, Pranab Mukherjee. I send my condo"
```

```
Output -> 'l'
```

```
Full Tweet -> "I was saddened to learn of the passing of India's former President, Pranab Mukherjee. I send my condolences to his family and the people of India as they grieve the loss of a great leader."
```

Since the RNN is moving through character by a character trying to predict the next character, it is trying to find patterns in sequences so it can predict which character makes the most sense. So where did our first model go wrong? The answer was links.

```
Example Tweet -> Clear winner of the #GOPDebate. Thank you for your support!  #MakeAmericaGreatAgain #Trump2016 http://pbs.twimg.com/media/CWXr9GVVAAAJITZ.jpg
```

Above is one of the tweets in the training list. Since links were so common in all the tweets, our model was finding that the best output given any input was simple a character like “/” which is found in any link. So I had to try again without links. I used some regex to quickly remove all of them. My regex isn’t that great so I used this [link](https://stackoverflow.com/questions/21932615/regular-expression-for-remove-link)which gave me a perfect expression to use when I was running into issues.

Running it a second time, I found that there was very little semblance in the tweets. In fact none of them actually made much sense. After looking at our validation loss, I came to the conclusion that there is simply too much variability in Trump’s tweeting patterns. This was causing the model to underfit and not actually create anything useful. To mitigate this, I only used the tweets from the past year. There were also some retweets in the dataset that were not indicative of how Trump actually tweets so I had to removed those. Running it a third time gave me better results.

```
China is grated a Fake Ad, just things would reins allow! We are making record progres will lose. I shut down entry from China very early!
We made most Governors look very good, even greater economy than it was before. Jobs are flowing, NASDAQ is already atoo reforting it?
Black Lives Matter leader states, “Ifthencledible stilding, but especially African American small businesses (never be allowed to serve in government again. Thank you!
I am a big dangerous people out of our great Country. Passed along was now michee. @Shedsely, wowall government will solve bigges for New York on November 3rd. We’re going to Reduce Taxes Ruling 201$, was very slippery. Absol is ready to done the praused by moreaps are close to me in Democrat run cities - and these cities thak professed by CAN s from it Washen In y had ng in Washington, D.C. to make sure LAW & ORDER is enforced Democrat Country, was mack to his “basem” totally I’ll-equippeditienatel never be allowed to served is ALLAWilling to our GREAT TESTIRE safe and courthoute in Portland, or any Federal Buind ducing @Keallara. Wh is lookill almost certainly takemed for he’s, lost crime (now have taken because his people told him he has no chuild in their 2% fee to NATO. We are therefore moving some troops out of George Thaick ry Pernse. This is beyond a normal mistake. Why isn’t the media reportersabve have much landed I am doing it again!
Congressman Joe Wilson is a champion for the people of Georgia!
The “stuption. LIG a ternid now will be receiving $13 Million Unsolicited Ballots are impossible for election. Said all good about me, in print, until the day I fired him. A small buling is already parll op the RIG the failed Supreme Court Justices, rebuilt our once depleted Military, Choice for Vets, 2A Protection, big Regulation Legendahe our rally to Saturday night and shut me coming their Convention. They will allow rampant crime, just as they do in Portland. If they ask us, as they mocke this, but the Anarchists & Agitators got carried away and don’t listen anymore - even forced Slow Joe Biden going to crited States in Minneapolis last night. The National Guard did a great job, and should do more testing. But even if who vandalizion safe in the ng exovered from soother Democrat run city from China very early!
We made most Governors look very good, even greater economy than it has been focused on finding treated like never before, if necessary!
OBAMAGATE MAR HOR d CAMPAIGN, AND GOT CAUGHT!
Why are Republicans allowing the Democrats to give @USTruction. If the cities are a mistake!
We ader ither @Kanarawapled them to do. It would destroy America!
The Biden- and our People. All the way? NO!
```

There were many mistakes in this group of tweets but this was substantially better than before. I ran this a few times before I got 10 good tweets I could use for the testing.

## Survey Results

Which of these tweets do you think are fake?

- Sorry to inform the Do Nothing Democrats and Corrupt Joe Biden. Massive Tax Hikes – They will make you very poor, FAST!
- Just In: Chinese State Media and their partner, the Do Nothing Democrats want to take off the name John Bolton.
- Too many Universities and School Systems are about Radical Left Indoctrination, not happy! False advertising!
- My Administration and I will bring Baltimore back, and faster, smarter, and tougher response than that. Get out there today, Joe!

Well, it’s a trick question they are all fake. Pretty convincing right?

My next step was to create a survey. To do this I used Google forms and created 5 questions that were structured like the following:

 ![](/assets/28ecf9b74cf8.png)

I included a fake tweet within a group of real tweets. I also included the option for the respondent to say they believe that none of the tweets were fake. Finally, I had to do some tweaking around with the wording of the actual question. Originally, I had set the question to be “Please pick the tweet you think is fake”. When I sent around this first iteration, I had a few people ask me if I was asking which tweet contained fake information or was actually fake. After that, I added in the disclaimer making sure the survey taker new that I was asking about which tweet was not actually real.

* I also want to add that I am not an expert in creating surveys. It is very possible that my wording in these questions created some confusion or biases. However, I tried my best and ran it by people who felt the same before sending it out to the public.

Once I made the survey, I used Mechanical Turk to disseminate this form out into the public. To ensure people had enough time, I allowed them 20 minutes to take the survey which is plenty of time to actually go and search this Twitter. However, there was no incentive to get 100% on this survey just like in real life. I made sure to get a variety of age groups so there would be a healthy mixture of respondents. For the question above this was the result:

 ![](/assets/70b97a99c477.png)

So the fake tweet in this one is “The Biden – and our People. All the way? NO!” which only about 9% of people were able to identify as the fake tweet. This was a bit surprising to me because this tweet actually has a grammatical mistake and doesn’t make much sense when you look at it. However, it was convincing enough to fool the average American.

The next question was even more surprising.

 ![](/assets/91fab5304f5a.png)

This fake tweet in this list is *“I am happy to inform all of the people living their Suburban Lifestyle Dream that your favorite President, me, went to Walter Reed Medicary Biren against Big Pharma, which I signed last week.”*. I felt like this one was an easier one to catch as a fake because a simple google search would show that there is nothing called *“Walter Reed Medicary Biren*“. On top of that, this tweet just doesn’t make sense. Looking back at the data, the model definitely saw that Trump had tweeted about the Walter Reed Medical Center when addressing his recent stroke accusations. Coincidentally, Biden had visited the same center during his campaign trail which is where the Biren comes from. Finally, Trump has tweeted a lot about big pharma this year. The model tried to concatenate all these into one cohesive tweet and it succeeded to some extent. However, out of the group, this is clearly the fake. Once again the data shows we were able to dupe many people:

 ![](/assets/e692c096021b.png)

With this question, people did much better than the one previous but 29% is still pretty low considering the vast amount of grammatical/spelling errors in that tweet. At this point, it was clear that on average only 16% of people were able to distinguish between what was real and what was fake.

## Conclusion

I think this experiment really shows that the majority of the population won’t be able to discern between what is genuine and what’s not. With November 3rd just around the corner and political ads in full swing, the use of A.I. for disseminating false information will be in full effect. What this small experiment shows is that these campaigns could actually cause serious damage if they are let out into the wild.

The scarier part of this whole test was how easy it is to set up a campaign like this. Hypothetically, it would cost $0 dollars to create an AI-driven disinformation campaign. All someone would have to do is use Google Colab, which gives an ample amount of free GPU time for training, with the code found online to generate very convincing fake tweets to send out. With some quick Googling one could improve the accuracy of this preliminary model by implementing things like [Attention Mechanisms](https://medium.com/datadriveninvestor/attention-in-rnns-321fbcd64f05#:~:text=www.datadriveninvestor.com,learning%20and%20of%20higher%20quality.&text=The%20encoder%20outputs%20a%20single,as%20input%20to%20the%20decoder)which would eventually eliminate the need for human intervention. With no human input, one could create automated bots that could increase the reach of this disinformation campaign. All this could be set up to operate independently within the next week.

I don’t want this post to scare people and make the public bearish on A.I. applications. I just want to make people aware of how susceptible we are as people to misinformation. As we get closer to election day, I would urge people to stay ever vigilant to what they read and do their own research before coming to a conclusion.
