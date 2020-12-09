import { Contact, Thread, Task, Email, URGENT, IMPORTANT, CAN_WAIT } from './data_objects/EmailObjects.js';

export const person0 = new Contact(0, 'Amy Cohen', 'person_images/0.jpg');
export const person1 = new Contact(1, 'Jonny Tomas', 'person_images/1.jpg');
export const person2 = new Contact(2, 'Dilon Landey', 'person_images/2.jpg');
export const person3 = new Contact(3, 'Joe Brand', 'person_images/3.jpg');
export const person4 = new Contact(4, 'Dimitry Kitaigorodsky', 'person_images/4.jpg');
export const person5 = new Contact(5, 'Mike Natanzon', 'person_images/5.jpg');
export const person6 = new Contact(6, 'Edwin Obama', 'person_images/6.jpg');
export const person7 = new Contact(7, 'David Zalmanson', 'person_images/7.jpg');
export const person8 = new Contact(8, 'Asaf Gal', 'person_images/8.jpg');
export const person9 = new Contact(9, 'Nik Ostrovsky', 'person_images/9.jpg');

export const email1 = new Email(
    person2,
    [person0, person1, person3, person4, person5, person6],
    {
        subject: "United States of America 2020 Election Results",
        text: "The President has refused to concede the race, making false claims about widespread voter fraud with no evidence and attempting to undermine the democratic process. Judges have repeatedly dismissed flimsy lawsuits claiming fraud, pointing out there has been no proof.Americans voted by mail in record numbers this year to protect themselves from exposure to coronavirus in the middle of a global pandemic. Experts had warned for months that there would be a lengthy vote count and that a result may not be known on the night of the election, or even days afterward. "
    },
    undefined,
    new Date(2020, 9, 12, 10, 20),
    true,
    URGENT
);

export const email2 = new Email(
    person0,
    [person2, person7, person8, person9],
    {
        subject: "For a More Creative Brain Follow These 5 Steps",
        text: "In the 1870s, newspapers and printers faced a very specific and very costly problem. Photography was a new and exciting medium at the time. Readers wanted to see more pictures, but nobody could figure out how to print images quickly and cheaply."
    },
    ['file1.doc'],
    new Date(2020, 9, 13, 10, 31),
    true,
    IMPORTANT,
    ['Tag B'],
    [
        new Task("This is an Important task", new Date(2020, 11, 8, 10), IMPORTANT, false),
        new Task("This is an Can wait task", new Date(2020, 11, 6, 10), CAN_WAIT, false),
        new Task("This is a Can wait task that is done", new Date(2020, 11, 12, 10), CAN_WAIT, true)
    ]
);

export const email3 = new Email(
    person3,
    [person0, person1],
    {
        subject: "How Innovative Ideas Arise",
        text: "Thwaites had assumed the toaster would be a relatively simple machine. By the time he was finished deconstructing it, however, there were more than 400 components laid out on his floor. The toaster contained over 100 different materials with three of the primary ones being plastic, nickel, and steel."
    },
    ['file2.pdf'],
    new Date(2020, 10, 10, 9, 30),
    true,
    IMPORTANT,
    ['Tag A']
);

export const email4 = new Email(
    person0,
    [person4, person3],
    {
        subject: "Zanshin: Learning the Art of Attention and Focus From a Legendary Samurai Archer",
        text: "To deepen his understanding of Japanese culture, Herrigel began training in Kyudo, the Japanese martial art of archery.He was taught by a legendary archer named Awa Kenzo.Kenzo was convinced that beginners should master the fundamentals of archery before attempting to shoot at a real target, and he took this method to the extreme.For the first four years of his training, Herrigel was only allowed to shoot at a roll of straw just seven feet away."
    },
    undefined,
    new Date(2020, 10, 12, 12, 8),
    false,
    IMPORTANT
);


export const email5 = new Email(
    person4,
    [person0],
    {
        subject: "The Ultimate Productivity Hack is Saying No",
        text: "This is not to say you should never attend another meeting, but the truth is that we say yes to many things we don't actually want to do. There are many meetings held that don't need to be held. There is a lot of code written that could be deleted."
    },
    ['file3.pdf', 'file4.doc'],
    new Date(2020, 10, 13, 8, 40),
    true,
    IMPORTANT
);

export const email6 = new Email(
    person0,
    [person9],
    {
        subject: "How Experts Figure What to Focus On",
        text: "I launched my first product without having any idea who I would sell it to. (Big surprise, nobody bought it.) I reached out to important people, mismanaged expectations, made stupid mistakes, and essentially ruined the chance to build good relationships with people I respected. I attempted to teach myself how to code, made one change to my website, and deleted everything I had done during the previous three months."
    },
    undefined,
    new Date(2020, 9, 6, 10, 25),
    true,
    CAN_WAIT
);

export const email7 = new Email(
    person9,
    [person0, person5],
    {
        subject: "Some subject of email 7",
        text: "The President has refused to concede the race, making false claims about widespread voter fraud with no evidence and attempting to undermine the democratic process. Judges have repeatedly dismissed flimsy lawsuits claiming fraud, pointing out there has been no proof.Americans voted by mail in record numbers this year to protect themselves from exposure to coronavirus in the middle of a global pandemic. Experts had warned for months that there would be a lengthy vote count and that a result may not be known on the night of the election, or even days afterward. "
    },
    undefined,
    new Date(2020, 9, 12, 10, 25),
    true,
    URGENT
);

export const email8 = new Email(
    person0,
    [person9, person5, person7],
    {
        subject: "Some subject of email 8",
        text: "In the 1870s, newspapers and printers faced a very specific and very costly problem. Photography was a new and exciting medium at the time. Readers wanted to see more pictures, but nobody could figure out how to print images quickly and cheaply."
    },
    ['file6.mov'],
    new Date(2020, 9, 18, 10, 35),
    true,
    IMPORTANT
);

export const email9 = new Email(
    person6,
    [person8, person9, person0],
    {
        subject: "Some subject of email 9",
        text: "Thwaites had assumed the toaster would be a relatively simple machine. By the time he was finished deconstructing it, however, there were more than 400 components laid out on his floor. The toaster contained over 100 different materials with three of the primary ones being plastic, nickel, and steel."
    },
    ['file7.gif'],
    new Date(),
    true,
    IMPORTANT,
    ['Tag1', 'Tag2'],
    [
        new Task("Setup a phone meeting2", new Date(2020, 11, 15, 10), CAN_WAIT, false),
        new Task("Setup a video meeting2", new Date(2020, 11, 16, 9), CAN_WAIT, true)
    ]

);

export const email10 = new Email(
    person0,
    [person7, person8, person1],
    {
        subject: "Zanshin: Learning the Art of Some subject of email 10",
        text: "To deepen his understanding of Japanese culture, Herrigel began training in Kyudo, the Japanese martial art of archery.He was taught by a legendary archer named Awa Kenzo.Kenzo was convinced that beginners should master the fundamentals of archery before attempting to shoot at a real target, and he took this method to the extreme.For the first four years of his training, Herrigel was only allowed to shoot at a roll of straw just seven feet away."
    },
    ['picture2.jpeg', 'table.xls'],
    new Date(2020, 10, 17, 12, 9),
    false,
    IMPORTANT,
    ['Flight', 'Car'],
    [
        new Task("Setup a phone meeting", new Date(2020, 11, 15, 10), CAN_WAIT, false),
        new Task("Setup a video meeting", new Date(2020, 11, 16, 9), IMPORTANT, false),
        new Task("Setup a physical meeting", new Date(2020, 11, 17, 8), CAN_WAIT, true)
    ]
);


export const email11 = new Email(
    person1,
    [person0, person7, person8],
    {
        subject: "Some subject of email 11",
        text: "This is not to say you should never attend another meeting, but the truth is that we say yes to many things we don't actually want to do. There are many meetings held that don't need to be held. There is a lot of code written that could be deleted."
    },
    ['picture1.png', 'document.doc'],
    new Date(2020, 10, 17, 13, 42),
    true,
    CAN_WAIT,
    [],
    [
        new Task("Some kind of urgent task", new Date(2020, 11, 14, 10), URGENT, false),
        new Task("Some kind of important task", new Date(2020, 11, 15, 9), IMPORTANT, true),
        new Task("A task of low priority", new Date(2020, 11, 16, 8), CAN_WAIT, false)
    ]
);

export const email12 = new Email(
    person2,
    [person4, person5, person0],
    {
        subject: "Some subject of email 12",
        text: "I launched my first product without having any idea who I would sell it to. (Big surprise, nobody bought it.) I reached out to important people, mismanaged expectations, made stupid mistakes, and essentially ruined the chance to build good relationships with people I respected. I attempted to teach myself how to code, made one change to my website, and deleted everything I had done during the previous three months."
    },
    undefined,
    new Date(2020, 10, 17, 14, 35),
    true,
    CAN_WAIT,
    [],
    [new Task("Some kind of important task2", new Date(2020, 11, 21, 10), IMPORTANT, false),
    new Task("Some kind of important task", new Date(2020, 11, 20, 9), IMPORTANT, true),
    new Task("A task of low priority", new Date(2020, 11, 19, 8), CAN_WAIT, false)
    ]
);


export var emailThread1 = new Thread(0, [email1, email2]);
export var emailThread2 = new Thread(1, [email3, email4, email5]);
export var emailThread3 = new Thread(2, [email6, email7, email8]);
export var emailThread4 = new Thread(3, [email9]);
export var emailThread5 = new Thread(4, [email10, email11]);
export var emailThread6 = new Thread(5, [email12]);

export const emailThreads = {
    threads: [emailThread1, emailThread2, emailThread3, emailThread4, emailThread5, emailThread6],
    selected_index: 1
}

export const ACCOUNT_USER = person0;