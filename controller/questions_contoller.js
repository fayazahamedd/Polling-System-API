const Question = require('../model/questions')
const Option = require('../model/options')

module.exports.create = async function (req, res) {
    try {
        // Validate request body
        if (!req.body.title || !req.body.options || !Array.isArray(req.body.options)) {
            return res.status(400).json({ error: "  " });
        }
        // Create question
        const question = await Question.create({ title: req.body.title });
        // Create options and associate with question
        const createdOptions = [];
        for (const optionData of req.body.options) {
            const option = await Option.create({
                option: optionData.content,
                question: question._id,
                add_vote: `http://localhost:8000/options/${question._id}/add_vote`

            });

            createdOptions.push(option);
        }
        // Update the question's options array
        question.options = createdOptions;
        await question.save();
        console.log("Question and options created:", question);
        res.status(200).json(question);
    } catch (err) {
        console.error("Error creating question:", err);
        res.status(501).json({ error: "Error creating question" });
    }
}

module.exports.showDetails = async function (req, res) {
    console.log(req.params.id);
    const ques = await Question.findById(req.params.id).populate('options'); // Use 'options' here
    if (ques) {
        console.log(ques)
        res.send(ques);
    } else {
        res.send("id does not exist");
    }
};

module.exports.deleteQues = async function (req, res) {
    try {
        const questionId = req.params.id;

        // Find the question
        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ error: "Question not found" });
        }
        // Delete options associated with the question
        await Option.deleteMany({ question: questionId });

        // Delete the question
        await Question.findByIdAndDelete(questionId);
        console.log('Question and associated options deleted')
        res.send("Question and associated options deleted");
    } catch (err) {
        console.error("Error deleting question:", err);
        res.status(500).json({ error: "Error deleting question" });
    }
};