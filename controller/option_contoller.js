const Option = require('../model/options');
const Question = require('../model/questions');


module.exports.create = async function (req, res) {
    console.log(req.body, req.params.id);

    try {
        const options = req.body; // Array of options
        const createdOptions = [];
        for (const optionData of options) {
            // Create the option with the provided content and question ID
            const opt = await Option.create({
                option: optionData.content,
                question: req.params.id,
            });
            // Update the add_vote field for the option
            const updateOpt = await Option.findByIdAndUpdate(opt._id, { "add_vote": `http://localhost:8000/options/${opt._id}/add_vote` });
            createdOptions.push(updateOpt);
        }

        // Find the question using the provided ID
        const ques = await Question.findById(req.params.id);
        if (ques) {
            // Push the created options to the question's options array
            ques.options.push(...createdOptions);
            await ques.save(); // Save the updated question

            console.log(ques);
            res.status(201).json(ques); // Return the updated question
        } else {
            res.status(404).json({ error: 'Question not found' });
        }
    } catch (err) {
        console.error("Error creating options:", err);
        res.status(500).json({ error: "Error creating options" });
    }
};


module.exports.add_vote = async function (req, res) {
    // in this votes will be added to the particular option of the question
    console.log(req.params.id)
    // this the increment query in which the vote is incremented by one 
    const opt = await Option.findByIdAndUpdate(req.params.id, { $inc: { vote: 1 } })
    if (opt) {
        await opt.save();
        console.log(opt);
        res.send(opt)
    }
    // handling the bad requests
    else {
        res.send('option does not exits')
    }
}

module.exports.delete = async function (req, res) {
    // delete the id option 
    console.log('id', req.params.id);
    const opt = await Option.findById(req.params.id);
    if (opt) {
        const quesId = opt.question;
        // finding the question to which the option is deleted and removing that option from its option array
        const ques = await Question.findByIdAndUpdate(quesId, { $pull: { options: req.params.id } });
        // now absolutely deleting that option
        await Option.findByIdAndDelete(req.params.id)

        console.log(ques);
        res.send('option deleted')
    }
    // handling the bad request
    else {
        res.send('id not exists')
    }
}